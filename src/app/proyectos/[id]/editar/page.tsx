import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { getNumberOrNull } from '@/lib/utils';

// Server Action to update a project
async function updateProject(id_proyecto: number, formData: FormData) {
  'use server';

  const titulo = formData.get('titulo') as string;
  if (!titulo || titulo.trim() === '') {
    throw new Error('El título es un campo obligatorio.');
  }

  let newCapturaPath: string | null = formData.get('current_captura') as string;
  if (newCapturaPath === '') newCapturaPath = null; // Ensure empty string becomes null

  const file = formData.get('captura') as File;
  const deleteCaptura = formData.get('delete_captura') === 'on';

  if (deleteCaptura) {
    if (newCapturaPath) { // If there is a path to delete
        try {
            const oldFilePath = path.join(process.cwd(), 'public', newCapturaPath);
            await unlink(oldFilePath);
        } catch (error) {
            console.error('Failed to delete old image file:', error);
        }
    }
    newCapturaPath = null; // Set path to null
  } else if (file && file.size > 0) {
    // New file upload takes precedence
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('La imagen no puede superar los 2MB.');
      if (!['image/jpeg', 'image/png'].includes(file.type)) throw new Error('Solo se permiten archivos JPG o PNG.');

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      await mkdir(uploadDir, { recursive: true });
      const uniqueFilename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);
      
      // If a new file is successfully uploaded, this is the new path.
      newCapturaPath = `/uploads/${uniqueFilename}`;

    } catch (error) {
        console.error('Error uploading file:', error);
        // IMPORTANT: If upload fails, we do NOT change the path. 
        // It will remain its original value from 'current_captura'.
        // We just log the error and proceed.
    }
  }

  const lenguajeIds = formData.getAll('lenguajes').map(id => Number(id));
  const baseDeDatosIds = formData.getAll('bases_de_datos').map(id => Number(id));

  const data = {
    titulo: titulo,
    storyline: formData.get('storyline') as string,
    activo: formData.get('activo') === 'on',
    id_dependencia_origen: getNumberOrNull(formData.get('id_dependencia_origen')),
    id_dependencia_actual: getNumberOrNull(formData.get('id_dependencia_actual')),
    id_categoria: getNumberOrNull(formData.get('id_categoria')),
    id_subcategoria: getNumberOrNull(formData.get('id_subcategoria')),
    tier: getNumberOrNull(formData.get('tier')),
    url_captura: newCapturaPath, // Use the final calculated path
    url_caratula: formData.get('url_caratula') as string,
    url_ticketera_interna: formData.get('url_ticketera_interna') as string,
    url_ticketera_externa: formData.get('url_ticketera_externa') as string,
    lenguajes: {
        deleteMany: {},
        create: lenguajeIds.map(id => ({ lenguaje: { connect: { id } } }))
    },
    bases_de_datos: {
        deleteMany: {},
        create: baseDeDatosIds.map(id => ({ base_de_datos: { connect: { id } } }))
    }
  };

  await prisma.proyecto.update({ where: { id: id_proyecto }, data });

  revalidatePath('/');
  revalidatePath(`/proyectos/${id_proyecto}`);
  redirect(`/proyectos/${id_proyecto}`);
}

export default async function EditarProyectoPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  // Fetch data sequentially to avoid potential Next.js issues with Promise.all in this context
  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    include: {
      lenguajes: { select: { id_lenguaje: true } },
      bases_de_datos: { select: { id_base_de_datos: true } },
    },
  });
  if (!proyecto) return notFound();

  const dependencias = await prisma.dependencia.findMany({ orderBy: { nombre: 'asc' } });
  const categorias = await prisma.categoria.findMany({ orderBy: { nombre: 'asc' } });
  const subcategorias = await prisma.subcategoria.findMany({ orderBy: { nombre: 'asc' } });
  const todosLenguajes = await prisma.lenguaje.findMany({ orderBy: { nombre: 'asc' } });
  const todasBasesDeDatos = await prisma.baseDeDatos.findMany({ orderBy: { nombre: 'asc' } });

  const updateProjectWithId = updateProject.bind(null, proyecto.id);
  const proyectoLenguajeIds = new Set(proyecto.lenguajes.map(l => l.id_lenguaje));
  const proyectoBaseDeDatosIds = new Set(proyecto.bases_de_datos.map(db => db.id_base_de_datos));

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Proyecto: {proyecto.titulo}</h1>
        
        <form action={updateProjectWithId} className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <input type="hidden" name="current_captura" value={proyecto.url_captura || ''} />
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-800 mb-1">Título del Proyecto <span className="text-red-500">*</span></label>
              <input type="text" name="titulo" id="titulo" required defaultValue={proyecto.titulo} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="storyline" className="block text-sm font-medium text-gray-800 mb-1">Storyline</label>
              <textarea name="storyline" id="storyline" rows={4} defaultValue={proyecto.storyline || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-800 mb-1">Categoría</label>
              <select name="id_categoria" id="id_categoria" defaultValue={proyecto.id_categoria || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="id_subcategoria" className="block text-sm font-medium text-gray-800 mb-1">Subcategoría</label>
              <select name="id_subcategoria" id="id_subcategoria" defaultValue={proyecto.id_subcategoria || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="lenguajes" className="block text-sm font-medium text-gray-800 mb-1">Lenguajes</label>
                <select multiple name="lenguajes" id="lenguajes" defaultValue={Array.from(proyectoLenguajeIds).map(String)} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    {todosLenguajes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                </select>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="id_dependencia_origen" className="block text-sm font-medium text-gray-800 mb-1">Dependencia Origen</label>
              <select name="id_dependencia_origen" id="id_dependencia_origen" defaultValue={proyecto.id_dependencia_origen || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="id_dependencia_actual" className="block text-sm font-medium text-gray-800 mb-1">Dependencia Actual</label>
              <select name="id_dependencia_actual" id="id_dependencia_actual" defaultValue={proyecto.id_dependencia_actual || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar...</option>
                {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="url_caratula" className="block text-sm font-medium text-gray-800 mb-1">URL Carátula</label>
              <input type="url" name="url_caratula" id="url_caratula" placeholder="https://..." defaultValue={proyecto.url_caratula || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="url_ticketera_interna" className="block text-sm font-medium text-gray-800 mb-1">URL Ticketera Interna</label>
              <input type="url" name="url_ticketera_interna" id="url_ticketera_interna" placeholder="https://..." defaultValue={proyecto.url_ticketera_interna || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="url_ticketera_externa" className="block text-sm font-medium text-gray-800 mb-1">URL Ticketera Externa</label>
              <input type="url" name="url_ticketera_externa" id="url_ticketera_externa" placeholder="https://..." defaultValue={proyecto.url_ticketera_externa || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label htmlFor="bases_de_datos" className="block text-sm font-medium text-gray-800 mb-1">Bases de Datos</label>
                <select multiple name="bases_de_datos" id="bases_de_datos" defaultValue={Array.from(proyectoBaseDeDatosIds).map(String)} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    {todasBasesDeDatos.map(db => <option key={db.id} value={db.id}>{db.nombre}</option>)}
                </select>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <label htmlFor="tier" className="block text-sm font-medium text-gray-800">Tier</label>
                    <input type="number" name="tier" id="tier" min="1" max="5" defaultValue={proyecto.tier || ''} className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="activo" id="activo" defaultChecked={proyecto.activo || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">Proyecto Activo</label>
                </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="md:col-span-2 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Captura de Pantalla</h3>
            {proyecto.url_captura ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <Image src={proyecto.url_captura} alt="Captura actual" width={300} height={200} className="rounded-md border" />
                <div className="flex items-center mt-2">
                  <input type="checkbox" name="delete_captura" id="delete_captura" className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <label htmlFor="delete_captura" className="ml-2 block text-sm font-medium text-red-600">
                    Eliminar imagen actual
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2">No hay ninguna imagen de captura subida.</p>
            )}
            <div>
              <label htmlFor="captura" className="block text-sm font-medium text-gray-800 mb-1">
                {proyecto.url_captura ? 'Reemplazar imagen' : 'Subir imagen'}
              </label>
              <input type="file" name="captura" id="captura" accept="image/jpeg, image/png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
            <Link href={`/proyectos/${proyecto.id}`} className="text-gray-600 hover:underline text-sm">Cancelar</Link>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </main>
  );
}