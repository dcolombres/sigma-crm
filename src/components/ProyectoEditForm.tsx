'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Proyecto, Cliente, Staff } from '@prisma/client';

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

interface ProyectoEditFormProps {
  proyecto: Proyecto & { staff: Staff[] };
  clientes: Cliente[];
  staff: Staff[];
  updateProjectWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function ProyectoEditForm({ proyecto, clientes, staff, updateProjectWithId }: ProyectoEditFormProps) {
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

  const stackValue = [
    proyecto.backend_lenguaje_principal,
    proyecto.backend_framework,
    proyecto.frontend_lenguaje_principal,
    proyecto.frontend_framework,
    proyecto.db_tecnologia,
  ].filter(Boolean).join(', ');

  return (
    <form action={dispatch} className="bg-white p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
      
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-1">Nombre <span className="text-red-500">*</span></label>
          <input type="text" name="nombre" id="nombre" required defaultValue={proyecto.nombre} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-primary mb-1">Descripción</label>
          <textarea name="descripcion" id="descripcion" rows={3} defaultValue={proyecto.descripcion || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
        <div>
          <label htmlFor="origen" className="block text-sm font-medium text-primary mb-1">Origen</label>
          <input type="text" name="origen" id="origen" defaultValue={proyecto.origen || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="dependencia" className="block text-sm font-medium text-primary mb-1">Dependencia</label>
          <input type="text" name="dependencia" id="dependencia" defaultValue={proyecto.dependencia || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="tier" className="block text-sm font-medium text-primary mb-1">Tier</label>
          <input type="text" name="tier" id="tier" defaultValue={proyecto.tier || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="idCliente" className="block text-sm font-medium text-primary mb-1">Cliente</label>
          <select name="idCliente" id="idCliente" defaultValue={proyecto.idCliente || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="stack" className="block text-sm font-medium text-primary mb-1">Stack</label>
          <textarea name="stack" id="stack" readOnly value={stackValue} className="w-full px-3 py-2 border border-gray-300 bg-gray-100 shadow-sm focus:outline-none" />
        </div>
        <div>
          <label htmlFor="equipo" className="block text-sm font-medium text-primary mb-1">Equipo</label>
          <select name="equipo" id="equipo" multiple defaultValue={proyecto.staff.map(s => s.id.toString())} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            {staff.map(s => <option key={s.id} value={s.id}>{s.nombres} {s.apellidos}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="id_responsable" className="block text-sm font-medium text-primary mb-1">Responsable</label>
          <select name="id_responsable" id="id_responsable" defaultValue={proyecto.id_responsable || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar...</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.nombres} {s.apellidos}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status_salud" className="block text-sm font-medium text-primary mb-1">Salud</label>
          <input type="text" name="status_salud" id="status_salud" defaultValue={proyecto.status_salud || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="status_pmo" className="block text-sm font-medium text-primary mb-1">Estado</label>
          <input type="text" name="status_pmo" id="status_pmo" defaultValue={proyecto.status_pmo || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-primary mb-1">Categoría</label>
          <input type="text" name="categoria" id="categoria" defaultValue={proyecto.categoria || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="subcategoria" className="block text-sm font-medium text-primary mb-1">Subcategoría</label>
          <input type="text" name="subcategoria" id="subcategoria" defaultValue={proyecto.subcategoria || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="observacion" className="block text-sm font-medium text-primary mb-1">Observación</label>
          <textarea name="observacion" id="observacion" rows={3} defaultValue={proyecto.observacion || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        </div>
        <div>
          <label htmlFor="captura_url" className="block text-sm font-medium text-primary mb-1">URL Captura</label>
          <input type="text" name="captura_url" id="captura_url" defaultValue={proyecto.captura_url || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="nube" className="block text-sm font-medium text-primary mb-1">Nube</label>
          <input type="text" name="nube" id="nube" defaultValue={proyecto.nube || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="ticketera_interna" className="block text-sm font-medium text-primary mb-1">Ticketera Interna</label>
          <input type="text" name="ticketera_interna" id="ticketera_interna" defaultValue={proyecto.ticketera_interna || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="ticketera_externa" className="block text-sm font-medium text-primary mb-1">Ticketera Externa</label>
          <input type="text" name="ticketera_externa" id="ticketera_externa" defaultValue={proyecto.ticketera_externa || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="url_changelog" className="block text-sm font-medium text-primary mb-1">URL Changelog</label>
          <input type="text" name="url_changelog" id="url_changelog" defaultValue={proyecto.url_changelog || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="anio_inicio_sistema" className="block text-sm font-medium text-primary mb-1">Año Inicio Sistema</label>
          <input type="number" name="anio_inicio_sistema" id="anio_inicio_sistema" defaultValue={proyecto.anio_inicio_sistema || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="usuarios_internos" className="block text-sm font-medium text-primary mb-1">Usuarios Internos</label>
          <input type="number" name="usuarios_internos" id="usuarios_internos" defaultValue={proyecto.usuarios_internos || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="usuarios_externos" className="block text-sm font-medium text-primary mb-1">Usuarios Externos</label>
          <input type="number" name="usuarios_externos" id="usuarios_externos" defaultValue={proyecto.usuarios_externos || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>

      {state.message && state.error && (
        <div className="md:col-span-3 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="md:col-span-3 flex justify-end items-center gap-4 mt-4">
        <Link href="/proyectos" className="text-secondary hover:underline text-sm no-underline">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
