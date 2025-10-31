'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { updateStaff } from '@/lib/actions';
import { Staff, Proyecto } from '@prisma/client';

interface StaffProyectosFormProps {
  staff: Staff & { proyectos: Proyecto[] };
  proyectos: Proyecto[];
}

export default function StaffProyectosForm({ staff, proyectos }: StaffProyectosFormProps) {
  const initialState = { message: "", error: false };
  const updateStaffWithId = updateStaff.bind(null, staff.id);
  const [state, formAction] = useFormState(updateStaffWithId, initialState);
  const formRef = useRef<HTMLFormElement>(null);

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
    <form ref={formRef} action={formAction} className="bg-white p-8 shadow-md">
      <div className="mb-4">
        <label htmlFor="proyectos" className="block text-sm font-medium text-gray-800 mb-1">Proyectos Asignados</label>
        <select 
          id="proyectos" 
          name="proyectos" 
          multiple 
          defaultValue={staff.proyectos.map(p => p.id.toString())} 
          className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          size={10}
        >
          {proyectos.map(proyecto => (
                         <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Mantén presionada la tecla Ctrl (o Cmd en Mac) para seleccionar múltiples proyectos.</p>
      </div>

      <div className="flex justify-end gap-4">
        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Actualizar Proyectos
        </button>
      </div>
    </form>
  );
}
