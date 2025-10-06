'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

const resourceTypes = ['proyectos', 'staff', 'clientes', 'integraciones'];

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = useMemo(() => pathname.split('/').filter(segment => segment), [pathname]);
  const [segmentNames, setSegmentNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSegmentNames = async () => {
      const newNames: Record<string, string> = {};
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const prevSegment = i > 0 ? pathSegments[i - 1] : null;

        if (prevSegment && resourceTypes.includes(prevSegment) && !isNaN(Number(segment))) {
          try {
            const response = await fetch(`/api/breadcrumbs?type=${prevSegment}&id=${segment}`);
            if (response.ok) {
              const data = await response.json();
              newNames[segment] = data.name;
            }
          } catch (error) {
            console.error('Failed to fetch breadcrumb name:', error);
          }
        }
      }
      setSegmentNames(newNames);
    };

    fetchSegmentNames();
  }, [pathSegments]);

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:underline">Inicio</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const displayName = segmentNames[segment] || segment;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="font-medium text-gray-700">{displayName}</span>
              ) : (
                <Link href={href} className="hover:underline">{displayName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
