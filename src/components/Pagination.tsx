'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  count: number;
  page: number;
  perPage: number;
}

export default function Pagination({ count, page, perPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(count / perPage);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-300 bg-card-bg px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link href={createPageURL(page - 1)} className={`relative inline-flex items-center rounded-md border border-gray-300 bg-card-bg px-4 py-2 text-sm font-medium text-primary hover:bg-background ${page <= 1 ? 'pointer-events-none text-secondary' : ''}`}>
          Anterior
        </Link>
        <Link href={createPageURL(page + 1)} className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-card-bg px-4 py-2 text-sm font-medium text-primary hover:bg-background ${page >= totalPages ? 'pointer-events-none text-secondary' : ''}`}>
          Siguiente
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-primary">
            Mostrando <span className="font-medium">{(page - 1) * perPage + 1}</span> a <span className="font-medium">{Math.min(page * perPage, count)}</span> de <span className="font-medium">{count}</span> resultados
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link href={createPageURL(page - 1)} className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-secondary ring-1 ring-inset ring-gray-300 hover:bg-background focus:z-20 focus:outline-offset-0 ${page <= 1 ? 'pointer-events-none' : ''}`}>
              <span className="sr-only">Anterior</span>
              &lt;
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <Link key={pageNumber} href={createPageURL(pageNumber)} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pageNumber ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary' : 'text-primary ring-1 ring-inset ring-gray-300 hover:bg-background focus:z-20 focus:outline-offset-0'}`}>
                {pageNumber}
              </Link>
            ))}
            <Link href={createPageURL(page + 1)} className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-secondary ring-1 ring-inset ring-gray-300 hover:bg-background focus:z-20 focus:outline-offset-0 ${page >= totalPages ? 'pointer-events-none' : ''}`}>
              <span className="sr-only">Siguiente</span>
              &gt;
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}