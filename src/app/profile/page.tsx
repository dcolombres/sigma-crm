import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { updateProfile } from '@/lib/actions';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>User not found</div>;
  }

  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    include: { staff: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8 font-poppins">Profile</h1>
      <ProfileForm user={user} updateProfile={updateProfile} />
    </div>
  );
}