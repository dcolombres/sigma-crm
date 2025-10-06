'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { User, Staff } from '@prisma/client';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-2 font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark disabled:bg-secondary/50 disabled:text-primary">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

interface ProfileFormProps {
  user: User & { staff: Staff | null };
  updateProfile: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function ProfileForm({ user, updateProfile }: ProfileFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(updateProfile, initialState);

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
    <form action={dispatch} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-medium text-primary mb-1">Nombre Completo</label>
          <input type="text" name="nombre_completo" id="nombre_completo" disabled defaultValue={user.staff?.nombre_completo || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email</label>
          <input type="email" name="email" id="email" disabled defaultValue={user.email} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
        </div>
      </div>

      <hr />

      <h2 className="text-xl font-bold text-primary">Cambiar Contraseña</h2>

      <div>
        <label htmlFor="current_password" className="block text-sm font-medium text-primary mb-1">Contraseña Actual</label>
        <input type="password" name="current_password" id="current_password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="new_password" className="block text-sm font-medium text-primary mb-1">Nueva Contraseña</label>
        <input type="password" name="new_password" id="new_password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-primary mb-1">Confirmar Nueva Contraseña</label>
        <input type="password" name="confirm_password" id="confirm_password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      {state.message && (
        <div className={`${state.error ? 'text-red-500' : 'text-green-500'} text-sm`}>
          {state.message}
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
