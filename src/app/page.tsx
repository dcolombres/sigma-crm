import Dashboard from '@/components/Dashboard';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      staff: true,
    },
  });

  return (
    <>
      <Dashboard user={user} />
    </>
  );
}
