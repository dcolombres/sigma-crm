import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StaffEditForm from '@/components/StaffEditForm';
import { updateStaff } from '@/lib/actions';

export default async function EditarStaffPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const staffMember = await prisma.staff.findUnique({ 
    where: { id },
    include: { proyectos: true },
  });

  if (!staffMember) {
    notFound();
  }

  const roles = [];
  const proyectos = await prisma.proyecto.findMany();

  const updateStaffWithId = updateStaff.bind(null, staffMember.id);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Miembro del Staff</h1>
        <StaffEditForm 
          staffMember={staffMember} 
          updateStaffWithId={updateStaffWithId} 
          allProyectos={proyectos} 
        />
      </div>
    </main>
  );
}