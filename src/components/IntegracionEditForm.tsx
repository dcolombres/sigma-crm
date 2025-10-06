'use client';

import { useEffect, useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Integracion, Staff } from '@prisma/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-6 py-2 font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark disabled:bg-secondary/50 disabled:text-primary">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

interface IntegracionEditFormProps {
  integracion: Integracion;
  staff: Staff[];
  updateIntegrationWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

export default function IntegracionEditForm({ integracion, staff, updateIntegrationWithId }: IntegracionEditFormProps) {
  const initialState = { message: "", error: false };
  const [state, dispatch] = useFormState(updateIntegrationWithId, initialState);
  const [isEditingDocumentation, setIsEditingDocumentation] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        setIsEditingDocumentation(false);
      }
    }
  }, [state]);

  return (
    <form action={dispatch} className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-6">
      
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-primary mb-1">Nombre Integración <span className="text-red-500">*</span></label>
        <input type="text" name="nombre" id="nombre" required defaultValue={integracion.nombre} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
      </div>

      <div>
        <label htmlFor="funcion_principal" className="block text-sm font-medium text-primary mb-1">Función Principal</label>
        <textarea name="funcion_principal" id="funcion_principal" rows={3} defaultValue={integracion.funcion_principal || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="documentacion" className="block text-sm font-medium text-primary">Documentación (Markdown)</label>
          <button type="button" onClick={() => setIsEditingDocumentation(!isEditingDocumentation)} className="text-sm font-medium text-primary hover:underline">
            {isEditingDocumentation ? 'Ver' : 'Editar'}
          </button>
        </div>
        {isEditingDocumentation ? (
          <textarea name="documentacion" id="documentacion" rows={10} defaultValue={integracion.documentacion || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
        ) : (
          <div className="prose prose-sm max-w-none p-4 border border-gray-200 rounded-md bg-gray-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {integracion.documentacion || 'No hay documentación.'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="id_responsable" className="block text-sm font-medium text-primary mb-1">Responsable</label>
        <select name="id_responsable" id="id_responsable" defaultValue={integracion.id_responsable || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar responsable...</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.nombre_completo}</option>)}
        </select>
      </div>

      {state.message && state.error && (
        <div className="text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-4">
        <Link href="/integraciones" className="text-secondary hover:underline text-sm">
          Cancelar
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
