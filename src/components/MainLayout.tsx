'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <div className={!isLoginPage ? 'ml-64' : ''}>
        {!isLoginPage && <Topbar />}
        <main className={isLoginPage ? '' : 'p-8'}>
          {children}
        </main>
      </div>
    </>
  );
}
