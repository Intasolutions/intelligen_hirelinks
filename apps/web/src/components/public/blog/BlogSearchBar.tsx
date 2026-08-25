'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { PillButton } from '../PillButton';

export function BlogSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');

  const submit = () => {
    const trimmed = query.trim();
    router.push(trimmed ? `/blog?search=${encodeURIComponent(trimmed)}` : '/blog');
  };

  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-[#e0e0e0] bg-white py-1.5 pl-5 pr-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#2a9d8f]" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.75} />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      </svg>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder="Search..."
        aria-label="Search blog posts"
        className="min-w-0 flex-1 bg-transparent font-sans text-sm text-black placeholder:text-black/40 focus:outline-none sm:text-base"
      />

      <PillButton
        href="#"
        onClick={(e) => {
          e.preventDefault();
          submit();
        }}
        iconOnly
        variant="solid"
        bgColor="#2a9d8f"
        textColor="#ffffff"
        aria-label="Search"
      >
        Search
      </PillButton>
    </div>
  );
}
