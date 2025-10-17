'use client';

import { ReactNode } from 'react';

interface ResponsiveTableProps {
  children: ReactNode;
}

export default function ResponsiveTable({ children }: ResponsiveTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-200">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}
