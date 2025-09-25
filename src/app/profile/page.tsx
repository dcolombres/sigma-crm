import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.staff.findUnique({ where: { email: session.user.email } });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <p className="mt-1 text-lg text-gray-900">{user.nombre_completo}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg text-gray-900">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-lg text-gray-900">{user.rol}</p>
        </div>
      </div>
    </div>
  );
}
