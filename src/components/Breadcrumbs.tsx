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
          <Link href="/" className="hover:underline">Inicio</Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <span className="mx-2">/</span>
            {item.isLast ? (
              <span className="font-medium text-gray-700">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:underline">{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}