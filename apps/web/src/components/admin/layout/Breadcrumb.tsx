'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Capitalize and format segments
  const formatSegment = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  return (
    <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join('/')}`;

          return (
            <li key={href} className="inline-flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}
              {isLast ? (
                <span className="font-medium text-gray-900">{formatSegment(segment)}</span>
              ) : (
                <Link href={href} className="hover:text-blue-600 transition-colors">
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
