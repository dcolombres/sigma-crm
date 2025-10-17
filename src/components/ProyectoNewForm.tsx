'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { Categoria, Subcategoria, Dependencia } from '@prisma/client';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {pending ? 'Guardando...' : 'Guardar Proyecto'}
    </button>
  );
}

interface ProyectoNewFormProps {
  createProject: (prevState: { message: string; error: boolean; projectId?: number }, formData: FormData) => Promise<{ message: string; error: boolean; projectId?: number }>;
  dependencias: Dependencia[];
  categorias: Categoria[];
  subcategorias: Subcategoria[];
}

export default function ProyectoNewForm({ createProject, dependencias, categorias, subcategorias }: ProyectoNewFormProps) {
  const router = useRouter();
  const initialState = { message: "", error: false, projectId: undefined };
  const [state, dispatch] = useFormState(createProject, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        if (state.projectId) {
          router.push(`/proyectos/${state.projectId}`);
        }
      }
    }
  }, [state, router]);

  return (
    <form action={dispatch} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-primary mb-1">Título del Proyecto <span className="text-red-500">*</span></label>
          <input type="text" name="titulo" id="titulo" required className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="storyline" className="block text-sm font-medium text-primary mb-1">Storyline</label>
          <textarea name="storyline" id="storyline" rows={4} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div>
          <label htmlFor="id_categoria" className="block text-sm font-medium text-primary mb-1">Categoría</label>
          <select name="id_categoria" id="id_categoria" className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="id_subcategoria" className="block text-sm font-medium text-primary mb-1">Subcategoría</label>
          <select name="id_subcategoria" id="id_subcategoria" className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>

         <div>
          <label htmlFor="captura" className="block text-sm font-medium text-primary mb-1">Captura de Pantalla (JPG/PNG, máx 2MB)</label>
          <input type="file" name="captura" id="captura" accept="image/jpeg, image/png" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"/>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="id_dependencia_origen" className="block text-sm font-medium text-primary mb-1">Dependencia Origen</label>
          <select name="id_dependencia_origen" id="id_dependencia_origen" className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="id_dependencia_actual" className="block text-sm font-medium text-primary mb-1">Dependencia Actual</label>
          <select name="id_dependencia_actual" id="id_dependencia_actual" className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {dependencias.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="url_ticketera_interna" className="block text-sm font-medium text-primary mb-1">URL Ticketera Interna</label>
          <input type="url" name="url_ticketera_interna" id="url_ticketera_interna" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="url_ticketera_externa" className="block text-sm font-medium text-primary mb-1">URL Ticketera Externa</label>
          <input type="url" name="url_ticketera_externa" id="url_ticketera_externa" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <label htmlFor="tier" className="block text-sm font-medium text-primary">Tier</label>
                <input type="number" name="tier" id="tier" min="1" max="5" className="w-24 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="activo" id="activo" defaultChecked className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
              <label htmlFor="activo" className="ml-2 block text-sm font-medium text-primary">Proyecto Activo</label>
            </div>
        </div>
      </div>

      {state.message && state.error && (
        <div className="md:col-span-2 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="md:col-span-2 flex justify-end mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
