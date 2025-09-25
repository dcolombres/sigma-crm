'use client';

import Image from 'next/image';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserMenu from './UserMenu'; // Import UserMenu

const Topbar = () => {
  return (
    <div className="bg-topbar-bg shadow-md h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input type="text" placeholder="Search..." className="bg-gray-100 border border-gray-200 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div className="flex items-center">
        <button className="mr-4">
          <BellIcon className="w-6 h-6 text-text-primary" />
        </button>
        <UserMenu />
      </div>
    </div>
  );
};

export default Topbar;