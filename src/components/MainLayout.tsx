'use client';

import { usePathname } from 'next/navigation';
import Topbar from './Topbar';

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="min-h-screen bg-background">
      {!isLoginPage && <Topbar />}
      <main className={isLoginPage ? '' : 'p-8'}>
        {children}
      </main>
    </div>
  );
}