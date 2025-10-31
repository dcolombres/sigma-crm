'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { Proyecto, DPR_AlojamientoInfra } from '@prisma/client';

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

interface DatabaseFormProps {
  proyecto: Proyecto;
  alojamientosInfra: DPR_AlojamientoInfra[];
  updateProjectWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function DatabaseForm({ proyecto, alojamientosInfra, updateProjectWithId }: DatabaseFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(updateProjectWithId, initialState);

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
      
      <div>
        <label htmlFor="id_alojamiento_infra_db" className="block text-sm font-medium text-primary mb-1">Alojamiento Infraestructura DB</label>
        <select name="id_alojamiento_infra_db" id="id_alojamiento_infra_db" defaultValue={proyecto.id_alojamiento_infra_db || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar...</option>
          {alojamientosInfra.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
