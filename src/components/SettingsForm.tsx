'use client';

import { Staff } from '@prisma/client';

export function SettingsForm({ staff }: { staff: Staff }) {

  return (
    <form className="bg-white p-8 shadow-md">
      <input type="hidden" name="staffId" value={staff.id} />
      
      <div className="mb-4 border-b pb-4">
        <h2 className="text-xl font-bold text-primary">Configuración General</h2>
        <p className="text-muted">Las configuraciones de integraciones han sido removidas.</p>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
          Guardar
        </button>
      </div>
    </form>
  );
}