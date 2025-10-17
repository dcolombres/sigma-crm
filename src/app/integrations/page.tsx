import prisma from '@/lib/prisma';
import { SettingsForm } from '@/components/SettingsForm';

export default async function IntegrationsPage() {
  const staff = await prisma.staff.findFirst();

  if (!staff) {
    return <div>Staff not found</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-primary mb-8 font-poppins">Integrations</h1>
      <SettingsForm staff={staff} />
    </div>
  );
}