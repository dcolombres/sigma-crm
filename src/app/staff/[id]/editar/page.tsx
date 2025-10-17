import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateStaff } from '@/lib/actions';
import StaffEditForm from '@/components/StaffEditForm';

export default async function EditarStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idString } = await params;
  const id = Number(idString);
  if (isNaN(id)) return notFound();

  const [staffMember, allProyectos] = await Promise.all([
    prisma.staff.findUnique({
      where: { id },
      include: {
        proyectos: { select: { id_proyecto: true } }
      }
    }),
    prisma.proyecto.findMany({ orderBy: { titulo: 'asc' } })
  ]);

  if (!staffMember) return notFound();
  
  const updateStaffWithId = updateStaff.bind(null, staffMember.id);

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold font-poppins text-primary">Editar Staff: {staffMember.nombre_completo}</h1>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Editar Staff</h1>
        <Link href="/staff" className="text-sm font-medium text-primary hover:underline no-underline">
          Volver a Staff
        </Link>
      </div>
        </div>
        
        <StaffEditForm
          staffMember={staffMember}
          allProyectos={allProyectos}
          updateStaffWithId={updateStaffWithId}
        />
    </div>
  );
}