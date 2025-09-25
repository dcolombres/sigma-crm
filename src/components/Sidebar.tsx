'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  UsersIcon,
  PuzzlePieceIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';

const SidebarLink = ({ href, icon: Icon, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-4 py-2 ${
          isActive
            ? 'bg-primary text-white'
            : 'text-sidebar-text hover:bg-sidebar-hover'
        }`}
      >
        <Icon className="w-6 h-6 mr-2" />
        {children}
      </Link>
    </li>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 bg-sidebar-bg h-full fixed border-r border-gray-200">
      <div className="p-4 flex justify-center">
        <Image src="/logosigma.svg" alt="SIGMA CRM Logo" width={41} height={50} priority />
      </div>
      <nav className="mt-4">
        <ul>
          <SidebarLink href="/" icon={HomeIcon}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/proyectos" icon={FolderIcon}>
            Proyectos
          </SidebarLink>
          <SidebarLink href="/staff" icon={UserGroupIcon}>
            Staff
          </SidebarLink>
          <SidebarLink href="/clientes" icon={UsersIcon}>
            Clientes
          </SidebarLink>
          <SidebarLink href="/integraciones" icon={PuzzlePieceIcon}>
            Integraciones
          </SidebarLink>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
