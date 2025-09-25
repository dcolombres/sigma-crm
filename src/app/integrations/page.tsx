import prisma from '@/lib/prisma';
import { SettingsForm } from '@/components/SettingsForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.staff.findUnique({ where: { email: session.user.email } });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-8">Integrations</h1>
      <SettingsForm user={user} />
    </div>
  );
}