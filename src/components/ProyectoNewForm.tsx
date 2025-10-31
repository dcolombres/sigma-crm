'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {pending ? 'Creando...' : 'Crear Proyecto'}
    </button>
  );
}

interface ProyectoNewFormProps {
  createProject: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function ProyectoNewForm({ createProject }: ProyectoNewFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(createProject, initialState);

  useEffect(() => {
    if (state.message && state.error) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-1">Nombre <span className="text-red-500">*</span></label>
          <input type="text" name="nombre" id="nombre" required className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="codigo_trazabilidad" className="block text-sm font-medium text-primary mb-1">Código de Trazabilidad</label>
          <input type="text" name="codigo_trazabilidad" id="codigo_trazabilidad" className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-primary mb-1">Descripción</label>
          <textarea name="descripcion" id="descripcion" rows={3} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
      </div>

      {state.message && state.error && (
        <div className="md:col-span-2 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
        <Link href="/proyectos" className="text-secondary hover:underline text-sm no-underline">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
