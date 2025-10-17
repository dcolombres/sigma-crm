import { createStaff } from '@/lib/actions';
import StaffNewForm from '@/components/StaffNewForm';
import Link from 'next/link';

export default function NuevoStaffPage() {
  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Añadir Nuevo Staff</h1>
        <Link href="/staff" className="text-sm font-medium text-primary hover:underline no-underline">
          Volver a Staff
        </Link>
      </div>
        
        <StaffNewForm createStaff={createStaff} />
      </div>
    </main>
  );
}