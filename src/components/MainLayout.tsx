'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

import { ToastProvider } from './ToastProvider';
import { ReactNode, useState } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background">
        <ToastProvider>{children}</ToastProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ToastProvider>
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <main className="p-8">
            {children}
          </main>
        </div>
      </ToastProvider>
    </div>
  );
}