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
  ChevronDoubleLeftIcon,
} from '@heroicons/react/24/outline';

const SidebarLink = ({ href, icon: Icon, isCollapsed, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center py-3 font-poppins font-medium text-sm transition-all duration-300 ${
          isActive
            ? 'bg-primary text-white'
            : 'text-sidebar-text hover:bg-sidebar-hover'
        } ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
      >
        <Icon className={`w-6 h-6 ${!isCollapsed ? 'mr-3' : ''}`} />
        {!isCollapsed && <span>{children}</span>}
      </Link>
    </li>
  );
};

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className={`bg-sidebar-bg h-full fixed border-r border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex justify-center items-center gap-2">
        <Image src="/logosigma.svg" alt="SIGMA CRM Logo" width={41} height={50} priority />
        {!isCollapsed && <span className="font-bold text-lg text-primary font-poppins">SIGMA</span>}
      </div>
      <nav className="mt-4">
        <ul>
          <SidebarLink href="/" icon={HomeIcon} isCollapsed={isCollapsed}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/proyectos" icon={FolderIcon} isCollapsed={isCollapsed}>
            Proyectos
          </SidebarLink>
          <SidebarLink href="/staff" icon={UserGroupIcon} isCollapsed={isCollapsed}>
            Staff
          </SidebarLink>
          <SidebarLink href="/clientes" icon={UsersIcon} isCollapsed={isCollapsed}>
            Clientes
          </SidebarLink>
          <SidebarLink href="/integraciones" icon={PuzzlePieceIcon} isCollapsed={isCollapsed}>
            Integraciones
          </SidebarLink>
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center py-3 text-sidebar-text hover:bg-sidebar-hover transition-all duration-300"
        >
          <ChevronDoubleLeftIcon className={`w-6 h-6 mx-auto transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;