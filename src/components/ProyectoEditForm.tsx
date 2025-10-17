'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Categoria, Subcategoria, Dependencia, Lenguaje, BaseDeDatos, Proyecto } from '@prisma/client';

import { useFormStatus, useFormState } from 'react-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

interface ProyectoEditFormProps {
  proyecto: Proyecto & {
    lenguajes: { id_lenguaje: number }[];
    bases_de_datos: { id_base_de_datos: number }[];
  };
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  dependencias: Dependencia[];
  todosLenguajes: Lenguaje[];
  todasBasesDeDatos: BaseDeDatos[];
  updateProjectWithId: (prevState: { message: string | null; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

export default function ProyectoEditForm({
  proyecto,
  categorias,
  subcategorias,
  dependencias,
  todosLenguajes,
  todasBasesDeDatos,
  updateProjectWithId,
}: ProyectoEditFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(updateProjectWithId, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        router.push(`/proyectos/${proyecto.id}`);
      }
    }
  }, [state, router, proyecto.id]);

  const proyectoLenguajeIds = new Set(proyecto.lenguajes.map(l => l.id_lenguaje));
  const proyectoBaseDeDatosIds = new Set(proyecto.bases_de_datos.map(db => db.id_base_de_datos));

  return (
    <form action={dispatch} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-primary mb-1">Título del Proyecto <span className="text-tag-red">*</span></label>
          <input type="text" name="titulo" id="titulo" required defaultValue={proyecto.titulo} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="storyline" className="block text-sm font-medium text-primary mb-1">Storyline</label>
          <textarea name="storyline" id="storyline" rows={4} defaultValue={proyecto.storyline || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
        <div>
          <label htmlFor="id_categoria" className="block text-sm font-medium text-primary mb-1">Categoría</label>
          <select name="id_categoria" id="id_categoria" defaultValue={proyecto.id_categoria || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="id_subcategoria" className="block text-sm font-medium text-primary mb-1">Subcategoría</label>
          <select name="id_subcategoria" id="id_subcategoria" defaultValue={proyecto.id_subcategoria || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>
        <div>
            <label htmlFor="lenguajes" className="block text-sm font-medium text-primary mb-1">Lenguajes</label>
            <select multiple name="lenguajes" id="lenguajes" defaultValue={Array.from(proyectoLenguajeIds).map(String)} className="w-full h-32 px-3 py-2 border border-gray-300 shadow-sm">
                {todosLenguajes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </select>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="id_dependencia_origen" className="block text-sm font-medium text-primary mb-1">Dependencia Origen</label>
          <select name="id_dependencia_origen" id="id_dependencia_origen" defaultValue={proyecto.id_dependencia_origen || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="id_dependencia_actual" className="block text-sm font-medium text-primary mb-1">Dependencia Actual</label>
          <select name="id_dependencia_actual" id="id_dependencia_actual" defaultValue={proyecto.id_dependencia_actual || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="url_ticketera_interna" className="block text-sm font-medium text-primary mb-1">URL Ticketera Interna</label>
          <input type="url" name="url_ticketera_interna" id="url_ticketera_interna" placeholder="https://..." defaultValue={proyecto.url_ticketera_interna || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="url_ticketera_externa" className="block text-sm font-medium text-primary mb-1">URL Ticketera Externa</label>
          <input type="url" name="url_ticketera_externa" id="url_ticketera_externa" placeholder="https://..." defaultValue={proyecto.url_ticketera_externa || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
            <label htmlFor="bases_de_datos" className="block text-sm font-medium text-primary mb-1">Bases de Datos</label>
            <select multiple name="bases_de_datos" id="bases_de_datos" defaultValue={Array.from(proyectoBaseDeDatosIds).map(String)} className="w-full h-32 px-3 py-2 border border-gray-300 shadow-sm">
                {todasBasesDeDatos.map(db => <option key={db.id} value={db.id}>{db.nombre}</option>)}
            </select>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <label htmlFor="tier" className="block text-sm font-medium text-primary">Tier</label>
                <input type="number" name="tier" id="tier" min="1" max="5" defaultValue={proyecto.tier || ''} className="w-24 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="activo" id="activo" defaultChecked={proyecto.activo || false} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
              <label htmlFor="activo" className="ml-2 block text-sm font-medium text-primary">Proyecto Activo</label>
            </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="md:col-span-2 pt-6 border-t border-gray-300">
        <h3 className="text-lg font-medium text-primary mb-2">Captura de Pantalla</h3>
        {proyecto.captura_type ? (
          <div className="mb-4">
            <p className="text-sm text-secondary mb-2">Imagen actual:</p>
            <Image src={`/api/proyectos/${proyecto.id}/captura`} alt="Captura actual" width={300} height={200} className="border" />
            <div className="flex items-center mt-2">
              <input type="checkbox" name="delete_captura" id="delete_captura" className="h-4 w-4 text-tag-red border-gray-300 focus:ring-tag-red" />
              <label htmlFor="delete_captura" className="ml-2 block text-sm font-medium text-tag-red">
                Eliminar imagen actual
              </label>
            </div>
          </div>
        ) : (
          <p className="text-sm text-secondary mb-2">No hay ninguna imagen de captura subida.</p>
        )}
        <div>
          <label htmlFor="captura" className="block text-sm font-medium text-primary mb-1">
            {proyecto.captura_type ? 'Reemplazar imagen' : 'Subir imagen'}
          </label>
          <input type="file" name="captura" id="captura" accept="image/jpeg, image/png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"/>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
        <Link href={`/proyectos/${proyecto.id}`} className="text-secondary hover:underline text-sm no-underline">Cancelar</Link>
        <SubmitButton />
      </div>
    </form>
  );
}
