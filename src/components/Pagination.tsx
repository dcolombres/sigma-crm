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

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <Link className="page-link no-underline" href={createPageURL(page - 1)} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </Link>
        </li>
        {pageNumbers.map((pageNumber, index) => (
          <li key={index} className={`page-item ${pageNumber === page ? 'active' : ''}`}>
            {pageNumber === '...' ? (
              <span className="page-link">...</span>
            ) : (
              <Link className="page-link no-underline" href={createPageURL(pageNumber)}>
                {pageNumber}
              </Link>
            )}
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <Link className="page-link no-underline" href={createPageURL(page + 1)} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}