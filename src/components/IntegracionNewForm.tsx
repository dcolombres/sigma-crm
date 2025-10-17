'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Staff } from '@prisma/client';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {pending ? 'Guardando...' : 'Guardar Integración'}
    </button>
  );
}

interface IntegracionNewFormProps {
  createIntegration: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
  staff: Staff[];
}

export default function IntegracionNewForm({ createIntegration, staff }: IntegracionNewFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(createIntegration, initialState);

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
          <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-1">Nombre Integración <span className="text-red-500">*</span></label>
          <input type="text" name="nombre" id="nombre" required className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="funcion_principal" className="block text-sm font-medium text-primary mb-1">Función Principal</label>
          <textarea name="funcion_principal" id="funcion_principal" rows={3} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="documentacion" className="block text-sm font-medium text-primary mb-1">Documentación (Markdown)</label>
          <textarea name="documentacion" id="documentacion" rows={5} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div>
          <label htmlFor="id_responsable" className="block text-sm font-medium text-primary mb-1">Responsable</label>
          <select name="id_responsable" id="id_responsable" className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar responsable...</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.nombre_completo}</option>)}
          </select>
        </div>
      </div>

      {state.message && state.error && (
        <div className="md:col-span-2 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
        <Link href="/integraciones" className="text-secondary hover:underline text-sm no-underline">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
