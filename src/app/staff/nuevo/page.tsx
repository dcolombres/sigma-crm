import { createStaff } from '@/lib/actions';
import StaffNewForm from '@/components/StaffNewForm';
import Link from 'next/link';

export default function NuevoStaffPage() {
  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Añadir Persona al Equipo</h1>
            <Link href="/staff" className="text-sm font-medium text-primary hover:underline">
                &larr; Volver a la lista
            </Link>
        </div>
        
        <StaffNewForm createStaff={createStaff} />
      </div>
    </main>
  );
}