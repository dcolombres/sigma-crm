'use client';

import Link from 'next/link';

type BreadcrumbItem = {
  href: string;
  label: string;
  isLast: boolean;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:underline no-underline">Inicio</Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <span className="mx-2">/</span>
            {item.isLast ? (
              <span className="font-medium text-gray-700">{item.label}</span>
            ) : (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                <Link href={item.href} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 no-underline">{item.label}</Link>
              </div>
            </li>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}