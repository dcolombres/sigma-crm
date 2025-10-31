'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { updateStaff } from '@/lib/actions';
import { Staff } from '@prisma/client';

interface StaffGeneralFormProps {
  staff: Staff;
}

function calculateAge(birthday: string | null | undefined): number | null {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function StaffGeneralForm({ staff }: StaffGeneralFormProps) {
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

  const age = calculateAge(staff.cumpleanos);

  return (
    <form ref={formRef} action={formAction} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      
      <div>
        <label htmlFor="nombres" className="block text-sm font-medium text-gray-800 mb-1">Nombres</label>
        <input type="text" id="nombres" name="nombres" defaultValue={staff.nombres} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
      </div>

      <div>
        <label htmlFor="apellidos" className="block text-sm font-medium text-gray-800 mb-1">Apellidos</label>
        <input type="text" id="apellidos" name="apellidos" defaultValue={staff.apellidos} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
        <input type="email" id="email" name="email" defaultValue={staff.email} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
      </div>

      <div>
        <label htmlFor="cumpleanos" className="block text-sm font-medium text-gray-800 mb-1">Fecha de Nacimiento</label>
        <input type="date" id="cumpleanos" name="cumpleanos" defaultValue={staff.cumpleanos || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="edad" className="block text-sm font-medium text-gray-800 mb-1">Edad</label>
        <input type="text" id="edad" name="edad" value={age !== null ? age : ''} readOnly className="w-full px-3 py-2 border border-gray-300 bg-gray-100 shadow-sm focus:outline-none" />
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="activo" name="activo" defaultChecked={staff.activo} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
        <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">Activo</label>
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Actualizar Staff
        </button>
      </div>
    </form>
  );
}
