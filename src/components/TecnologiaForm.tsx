'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { createOrUpdateTecnologia } from '@/lib/actions';

export function TecnologiaForm({ id_proyecto, tecnologia, controlVersiones, statusPmo, statusSalud, alojamientoInfra, alojamientoInfraDB }) {
  const [state, formAction] = useFormState(createOrUpdateTecnologia, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === 'success') {
      toast.success(state.message);
      formRef.current?.reset();
    }
    if (state?.status === 'error') {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <input type="hidden" name="id_proyecto" value={id_proyecto} />
      {/* Column 1 */}      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="id_alojamiento_infra" className="block text-sm font-medium text-gray-800 mb-1">Alojamiento Infra</label>
          <select name="id_alojamiento_infra" id="id_alojamiento_infra" defaultValue={tecnologia?.id_alojamiento_infra || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar...</option>
            {alojamientoInfra.map(ai => <option key={ai.id} value={ai.id}>{ai.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="id_alojamiento_infra_db" className="block text-sm font-medium text-gray-800 mb-1">Alojamiento Infra DB</label>
          <select name="id_alojamiento_infra_db" id="id_alojamiento_infra_db" defaultValue={tecnologia?.id_alojamiento_infra_db || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar...</option>
            {alojamientoInfraDB.map(aidb => <option key={aidb.id} value={aidb.id}>{aidb.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="id_control_versiones" className="block text-sm font-medium text-gray-800 mb-1">Control de Versiones</label>
          <select name="id_control_versiones" id="id_control_versiones" defaultValue={tecnologia?.id_control_versiones || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar...</option>
            {controlVersiones.map(cv => <option key={cv.id} value={cv.id}>{cv.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="url_changelog" className="block text-sm font-medium text-gray-800 mb-1">URL Changelog</label>
          <input type="url" name="url_changelog" id="url_changelog" placeholder="https://..." defaultValue={tecnologia?.url_changelog || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="changelog" id="changelog" defaultChecked={tecnologia?.changelog || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="changelog" className="ml-2 block text-sm font-medium text-gray-900">Changelog Disponible</label>
        </div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="id_status_pmo" className="block text-sm font-medium text-gray-800 mb-1">Estado PMO</label>
          <select name="id_status_pmo" id="id_status_pmo" defaultValue={tecnologia?.id_status_pmo || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar...</option>
            {statusPmo.map(sp => <option key={sp.id} value={sp.id}>{sp.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="id_status_salud" className="block text-sm font-medium text-gray-800 mb-1">Salud del Sistema</label>
          <select name="id_status_salud" id="id_status_salud" defaultValue={tecnologia?.id_status_salud || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar...</option>
            {statusSalud.map(ss => <option key={ss.id} value={ss.id}>{ss.nombre}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="anio_inicio_sistema" className="block text-sm font-medium text-gray-800 mb-1">Año Inicio Sistema</label>
          <input type="number" name="anio_inicio_sistema" id="anio_inicio_sistema" min="2000" defaultValue={tecnologia?.anio_inicio_sistema || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="usuarios_internos" className="block text-sm font-medium text-gray-800 mb-1">Usuarios Internos</label>
          <input type="number" name="usuarios_internos" id="usuarios_internos" defaultValue={tecnologia?.usuarios_internos || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label htmlFor="usuarios_externos" className="block text-sm font-medium text-gray-800 mb-1">Usuarios Externos</label>
          <input type="number" name="usuarios_externos" id="usuarios_externos" defaultValue={tecnologia?.usuarios_externos || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="mantenimiento_soporte" id="mantenimiento_soporte" defaultChecked={tecnologia?.mantenimiento_soporte || false} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="mantenimiento_soporte" className="ml-2 block text-sm font-medium text-gray-900">Mantenimiento y Soporte</label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
        <Link href={`/proyectos/${id_proyecto}`} className="text-gray-600 hover:underline text-sm">
          Cancelar
        </Link>
        <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
          Guardar Tecnología
        </button>
      </div>
    </form>
  );
}
