'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Cliente, Proyecto } from '@prisma/client';

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

interface ClienteEditFormProps {
  client: Cliente;
  updateClientWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function ClienteEditForm({ client, updateClientWithId }: ClienteEditFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(updateClientWithId, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  return (
    <form action={dispatch} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-1">Nombre <span className="text-red-500">*</span></label>
          <input type="text" name="nombre" id="nombre" required defaultValue={client.nombre} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email</label>
          <input type="email" name="email" id="email" defaultValue={client.email || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="celular" className="block text-sm font-medium text-primary mb-1">Celular</label>
          <input type="text" name="celular" id="celular" defaultValue={client.celular || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="fecha_inicio_desarrollo" className="block text-sm font-medium text-primary mb-1">Fecha Inicio de Desarrollo</label>
          <input type="date" name="fecha_inicio_desarrollo" id="fecha_inicio_desarrollo" defaultValue={client.fecha_inicio_desarrollo?.toISOString().split('T')[0] || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="observacion" className="block text-sm font-medium text-primary mb-1">Observación</label>
          <textarea name="observacion" id="observacion" rows={3} defaultValue={client.observacion || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="flex items-center">
            <input type="checkbox" name="activo" id="activo" defaultChecked={client.activo || false} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
            <label htmlFor="activo" className="ml-2 block text-sm font-medium text-primary">Cliente Activo</label>
        </div>
      </div>

      {state.message && state.error && (
        <div className="md:col-span-2 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-4">
        <Link href="/clientes" className="text-secondary hover:underline text-sm no-underline">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
