import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages to show around current page
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((pageNumber, index) => (
          <li key={index} className={`page-item ${pageNumber === page ? 'active' : ''}`}>
            {typeof pageNumber === 'string' ? (
              <span className="page-link">...</span>
            ) : (
              <Link className="page-link no-underline" href={createPageURL(pageNumber)}>
                {pageNumber}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
