'use client';

import { useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { Proyecto, DPR_Plataforma, DPR_TipoDesarrollo, DPR_ControlVersiones, DPR_TipoSistema } from '@prisma/client';

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

interface TecnologiaFormProps {
  proyecto: Proyecto;
  plataformas: DPR_Plataforma[];
  tiposDesarrollo: DPR_TipoDesarrollo[];
  controlesVersiones: DPR_ControlVersiones[];
  tiposSistema: DPR_TipoSistema[];
  updateProjectWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function TecnologiaForm({ proyecto, plataformas, tiposDesarrollo, controlesVersiones, tiposSistema, updateProjectWithId }: TecnologiaFormProps) {
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
        <label htmlFor="id_plataforma" className="block text-sm font-medium text-primary mb-1">Plataforma</label>
        <select name="id_plataforma" id="id_plataforma" defaultValue={proyecto.id_plataforma || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar...</option>
          {plataformas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="id_tipo_desarrollo" className="block text-sm font-medium text-primary mb-1">Tipo de Desarrollo</label>
        <select name="id_tipo_desarrollo" id="id_tipo_desarrollo" defaultValue={proyecto.id_tipo_desarrollo || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar...</option>
          {tiposDesarrollo.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="id_control_versiones" className="block text-sm font-medium text-primary mb-1">Control de Versiones</label>
        <select name="id_control_versiones" id="id_control_versiones" defaultValue={proyecto.id_control_versiones || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar...</option>
          {controlesVersiones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="url_control_versiones" className="block text-sm font-medium text-primary mb-1">URL Control de Versiones</label>
        <input type="text" name="url_control_versiones" id="url_control_versiones" defaultValue={proyecto.url_control_versiones || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="id_tipo_sistema" className="block text-sm font-medium text-primary mb-1">Tipo de Sistema</label>
        <select name="id_tipo_sistema" id="id_tipo_sistema" defaultValue={proyecto.id_tipo_sistema || ''} className="w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar...</option>
          {tiposSistema.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}