import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Server Action to create a project
async function createProject(formData: FormData) {
  'use server';

  const titulo = formData.get('titulo') as string;
  if (!titulo || titulo.trim() === '') {
    // In a real app, you'd want to return this error to the user
    throw new Error('El título es un campo obligatorio.');
  }

  // Helper to convert form values to numbers or null
  const getNumberOrNull = (value: FormDataEntryValue | null): number | null => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }
    return null;
  };

  // 1. Handle File Upload
  const file = formData.get('captura') as File;
  let capturaPath: string | undefined = undefined;

  if (file && file.size > 0) {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('La imagen no puede superar los 2MB.');
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Solo se permiten archivos JPG o PNG.');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);
    capturaPath = `/uploads/${uniqueFilename}`;
  }

  // 2. Prepare data for DB
  const data = {
    titulo: titulo,
    storyline: formData.get('storyline') as string,
    activo: formData.get('activo') === 'on',
    id_dependencia_origen: getNumberOrNull(formData.get('id_dependencia_origen')),
    id_dependencia_actual: getNumberOrNull(formData.get('id_dependencia_actual')),
    id_categoria: getNumberOrNull(formData.get('id_categoria')),
    id_subcategoria: getNumberOrNull(formData.get('id_subcategoria')),
    tier: getNumberOrNull(formData.get('tier')),
    url_captura: capturaPath, // Use the file path here
    url_caratula: formData.get('url_caratula') as string,
    url_ticketera_interna: formData.get('url_ticketera_interna') as string,
    url_ticketera_externa: formData.get('url_ticketera_externa') as string,
  };

  // 3. Create Project in DB
  await prisma.proyecto.create({ data });

  // 4. Revalidate and Redirect
  revalidatePath('/');
  redirect('/');
}

// The page component
export default async function NuevoProyectoPage() {
  const [dependencias, categorias, subcategorias] = await Promise.all([
    prisma.dependencia.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.categoria.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.subcategoria.findMany({ orderBy: { nombre: 'asc' } }),
  ]);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Nuevo Proyecto</h1>
        
        <form action={createProject} className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-800 mb-1">Título del Proyecto <span className="text-red-500">*</span></label>
              <input type="text" name="titulo" id="titulo" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="storyline" className="block text-sm font-medium text-gray-800 mb-1">Storyline</label>
              <textarea name="storyline" id="storyline" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <div>
              <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-800 mb-1">Categoría</label>
              <select name="id_categoria" id="id_categoria" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="id_subcategoria" className="block text-sm font-medium text-gray-800 mb-1">Subcategoría</label>
              <select name="id_subcategoria" id="id_subcategoria" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>

             <div>
              <label htmlFor="captura" className="block text-sm font-medium text-gray-800 mb-1">Captura de Pantalla (JPG/PNG, máx 2MB)</label>
              <input type="file" name="captura" id="captura" accept="image/jpeg, image/png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="id_dependencia_origen" className="block text-sm font-medium text-gray-800 mb-1">Dependencia Origen</label>
              <select name="id_dependencia_origen" id="id_dependencia_origen" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="id_dependencia_actual" className="block text-sm font-medium text-gray-800 mb-1">Dependencia Actual</label>
              <select name="id_dependencia_actual" id="id_dependencia_actual" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="url_caratula" className="block text-sm font-medium text-gray-800 mb-1">URL Carátula</label>
              <input type="url" name="url_caratula" id="url_caratula" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="url_ticketera_interna" className="block text-sm font-medium text-gray-800 mb-1">URL Ticketera Interna</label>
              <input type="url" name="url_ticketera_interna" id="url_ticketera_interna" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label htmlFor="url_ticketera_externa" className="block text-sm font-medium text-gray-800 mb-1">URL Ticketera Externa</label>
              <input type="url" name="url_ticketera_externa" id="url_ticketera_externa" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <label htmlFor="tier" className="block text-sm font-medium text-gray-800">Tier</label>
                    <input type="number" name="tier" id="tier" min="1" max="5" className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="activo" id="activo" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">Proyecto Activo</label>
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
              Guardar Proyecto
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
