'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { UserIcon, Cog8ToothIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

const UserMenu = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <UserIcon className="w-8 h-8 rounded-full bg-gray-200 p-1" />
        <span className="text-sm font-medium">{user.name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="border-t border-gray-100"></div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <UserIcon className="w-5 h-5 mr-2 inline-block" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Cog8ToothIcon className="w-5 h-5 mr-2 inline-block" />
            Settings
          </Link>
          <div className="border-t border-gray-100"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-2 inline-block" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;