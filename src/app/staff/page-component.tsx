import { prisma } from '@/lib/prisma';
import StaffTable from '@/components/StaffTable';
import { deleteStaff } from '@/lib/actions';

export default async function StaffPageComponent() {
  const [staff, count] = await prisma.$transaction([
    prisma.staff.findMany(),
    prisma.staff.count(),
  ]);

  const totalPages = 1;

  return (
    <StaffTable 
      staff={staff} 
      deleteStaff={deleteStaff} 
      page={1}
      totalPages={totalPages}
      sort="nombres"
      order="asc"
      search=""
    />
  );
}