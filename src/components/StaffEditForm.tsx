'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Staff, Proyecto } from '@prisma/client';

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

interface StaffEditFormProps {
  staffMember: Staff & { proyectos: Proyecto[] };
  allProyectos: Proyecto[];
  updateStaffWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function StaffEditForm({ staffMember, allProyectos, updateStaffWithId }: StaffEditFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(updateStaffWithId, initialState);
  const staffProjectIds = new Set(staffMember.proyectos.map(p => p.id));

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
          <label htmlFor="nombres" className="block text-sm font-medium text-primary mb-1">Nombres <span className="text-tag-red">*</span></label>
          <input type="text" name="nombres" id="nombres" required defaultValue={staffMember.nombres || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-primary mb-1">Apellidos <span className="text-tag-red">*</span></label>
          <input type="text" name="apellidos" id="apellidos" required defaultValue={staffMember.apellidos || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email <span className="text-tag-red">*</span></label>
          <input type="email" name="email" id="email" required defaultValue={staffMember.email} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="rol_staff" className="block text-sm font-medium text-primary mb-1">Rol</label>
          <input type="text" name="rol_staff" id="rol_staff" defaultValue={staffMember.rol_staff || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="contrato" className="block text-sm font-medium text-primary mb-1">Contrato</label>
          <input type="text" name="contrato" id="contrato" defaultValue={staffMember.contrato || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="modalidad" className="block text-sm font-medium text-primary mb-1">Modalidad</label>
          <input type="text" name="modalidad" id="modalidad" defaultValue={staffMember.modalidad || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="experiencia" className="block text-sm font-medium text-primary mb-1">Experiencia</label>
          <input type="text" name="experiencia" id="experiencia" defaultValue={staffMember.experiencia || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="origen" className="block text-sm font-medium text-primary mb-1">Origen</label>
          <input type="text" name="origen" id="origen" defaultValue={staffMember.origen || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="desempeno_ley_dto" className="block text-sm font-medium text-primary mb-1">Desempeño Ley DTO</label>
          <input type="text" name="desempeno_ley_dto" id="desempeno_ley_dto" defaultValue={staffMember.desempeno_ley_dto || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="coordinacion" className="block text-sm font-medium text-primary mb-1">Coordinación</label>
          <input type="text" name="coordinacion" id="coordinacion" defaultValue={staffMember.coordinacion || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="presencialidad" className="block text-sm font-medium text-primary mb-1">Presencialidad</label>
          <input type="text" name="presencialidad" id="presencialidad" defaultValue={staffMember.presencialidad || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label htmlFor="cumpleanos" className="block text-sm font-medium text-primary mb-1">Fecha de Nacimiento</label>
          <input type="date" name="cumpleanos" id="cumpleanos" defaultValue={staffMember.cumpleanos ? new Date(staffMember.cumpleanos).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="comentario" className="block text-sm font-medium text-primary mb-1">Comentario</label>
          <textarea name="comentario" id="comentario" rows={3} defaultValue={staffMember.comentario || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="skills" className="block text-sm font-medium text-primary mb-1">Skills</label>
          <textarea name="skills" id="skills" rows={3} defaultValue={staffMember.skills || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
      </div>

      <div className="md:col-span-2">
          <label htmlFor="proyectos" className="block text-sm font-medium text-primary mb-1">Proyectos Asignados</label>
          <select
              multiple
              name="proyectos"
              id="proyectos"
              defaultValue={Array.from(staffProjectIds).map(String)}
              className="w-full h-40 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
              {allProyectos.map(proyecto => (
                  <option key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre}
                  </option>
              ))}
          </select>
      </div>

      <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" name="activo" id="activo" defaultChecked={staffMember.activo || false} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
            <label htmlFor="activo" className="text-sm font-medium">Activo</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="hhee" id="hhee" defaultChecked={staffMember.hhee || false} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
            <label htmlFor="hhee" className="text-sm font-medium">HHEE</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="ur" id="ur" defaultChecked={staffMember.ur || false} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
            <label htmlFor="ur" className="text-sm font-medium">UR</label>
          </div>
      </div>

      {state.message && state.error && (
        <div className="md:col-span-2 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-8">
        <Link href="/staff" className="text-sm text-secondary hover:underline no-underline">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
