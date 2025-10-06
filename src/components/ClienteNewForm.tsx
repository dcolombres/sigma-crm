'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Proyecto } from '@prisma/client';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-2 font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark disabled:bg-secondary/50 disabled:text-primary">
      {pending ? 'Guardando...' : 'Guardar Cliente'}
    </button>
  );
}

interface ClienteNewFormProps {
  createClient: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
  proyectos: Proyecto[];
  preselectedProjectId?: string;
}

export default function ClienteNewForm({ createClient, proyectos, preselectedProjectId }: ClienteNewFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(createClient, initialState);

  useEffect(() => {
    if (state.message && state.error) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={dispatch} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
      
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-1">Nombre <span className="text-red-500">*</span></label>
        <input type="text" name="nombre" id="nombre" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="id_proyecto" className="block text-sm font-medium text-primary mb-1">Proyecto Asociado <span className="text-red-500">*</span></label>
        <select 
          name="id_proyecto" 
          id="id_proyecto" 
          required 
          defaultValue={preselectedProjectId}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="">Seleccionar proyecto...</option>
          {proyectos.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email</label>
        <input type="email" name="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="celular" className="block text-sm font-medium text-primary mb-1">Celular</label>
        <input type="text" name="celular" id="celular" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="fecha_inicio_desarrollo" className="block text-sm font-medium text-primary mb-1">Fecha Inicio de Desarrollo</label>
        <input type="date" name="fecha_inicio_desarrollo" id="fecha_inicio_desarrollo" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="observacion" className="block text-sm font-medium text-primary mb-1">Observación</label>
        <textarea name="observacion" id="observacion" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
      </div>

      <div className="flex items-center">
          <input type="checkbox" name="activo" id="activo" defaultChecked className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
          <label htmlFor="activo" className="ml-2 block text-sm font-medium text-primary">Cliente Activo</label>
      </div>

      {state.message && state.error && (
        <div className="text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-4">
        <Link href="/clientes" className="text-secondary hover:underline text-sm">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
