import prisma from '@/lib/prisma';
import { SettingsForm } from '@/components/SettingsForm';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-primary mb-8 font-poppins">Integrations</h1>
      <SettingsForm user={user} />
    </div>
  );
}