'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { updateStaff } from '@/lib/actions';
import { Staff } from '@prisma/client';

interface StaffContratoFormProps {
  staff: Staff;
}

export default function StaffContratoForm({ staff }: StaffContratoFormProps) {
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
        <label htmlFor="contrato" className="block text-sm font-medium text-gray-800 mb-1">Contrato</label>
        <input type="text" id="contrato" name="contrato" defaultValue={staff.contrato || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="rol_staff" className="block text-sm font-medium text-gray-800 mb-1">Rol</label>
        <input type="text" id="rol_staff" name="rol_staff" defaultValue={staff.rol_staff || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="modalidad" className="block text-sm font-medium text-gray-800 mb-1">Modalidad</label>
        <input type="text" id="modalidad" name="modalidad" defaultValue={staff.modalidad || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="origen" className="block text-sm font-medium text-gray-800 mb-1">Origen</label>
        <input type="text" id="origen" name="origen" defaultValue={staff.origen || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="coordinacion" className="block text-sm font-medium text-gray-800 mb-1">Coordinación</label>
        <input type="text" id="coordinacion" name="coordinacion" defaultValue={staff.coordinacion || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="presencialidad" className="block text-sm font-medium text-gray-800 mb-1">Presencialidad</label>
        <input type="text" id="presencialidad" name="presencialidad" defaultValue={staff.presencialidad || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="hhee" name="hhee" defaultChecked={staff.hhee} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
        <label htmlFor="hhee" className="ml-2 block text-sm text-gray-900">HHEE</label>
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="ur" name="ur" defaultChecked={staff.ur} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
        <label htmlFor="ur" className="ml-2 block text-sm text-gray-900">UR</label>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Actualizar Contrato
        </button>
      </div>
    </form>
  );
}
