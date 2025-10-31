'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { updateStaff } from '@/lib/actions';
import { Staff } from '@prisma/client';

interface StaffDesempenoFormProps {
  staff: Staff;
}

export default function StaffDesempenoForm({ staff }: StaffDesempenoFormProps) {
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
    <form ref={formRef} action={formAction} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      
      <div>
        <label htmlFor="experiencia" className="block text-sm font-medium text-gray-800 mb-1">Experiencia</label>
        <input type="text" id="experiencia" name="experiencia" defaultValue={staff.experiencia || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="skills" className="block text-sm font-medium text-gray-800 mb-1">Skills</label>
        <textarea id="skills" name="skills" rows={4} defaultValue={staff.skills || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
      </div>

      <div>
        <label htmlFor="desempeno_ley_dto" className="block text-sm font-medium text-gray-800 mb-1">Desempeño Ley Dto</label>
        <input type="text" id="desempeno_ley_dto" name="desempeno_ley_dto" defaultValue={staff.desempeno_ley_dto || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-800 mb-1">Comentario</label>
        <textarea id="comentario" name="comentario" rows={4} defaultValue={staff.comentario || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Actualizar Desempeño
        </button>
      </div>
    </form>
  );
}
