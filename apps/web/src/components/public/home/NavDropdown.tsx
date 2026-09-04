'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export interface NavDropdownItem {
  title: string;
  slug: string;
}

interface NavDropdownProps {
  label: string;
  /** e.g. "/services" — items link to `${basePath}/${slug}`, "View all" links here. */
  basePath: string;
  fetchItems: () => Promise<NavDropdownItem[]>;
}

// Only rendered by Header.tsx when the current route is already under
// basePath (e.g. viewing a service detail page) — the plain nav link
// elsewhere is unchanged. Items load on mount rather than on open since the
// list is small and this avoids a loading flash on first hover/focus.
export function NavDropdown({ label, basePath, fetchItems }: NavDropdownProps) {
  const pathname = usePathname();
  const [items, setItems] = useState<NavDropdownItem[] | null>(null);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchItems()
      .then((result) => {
        if (!cancelled) setItems(result.slice(0, 5));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchItems]);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  // Short delay before closing so moving the pointer from the trigger label
  // down into the panel (crossing the gap between them) doesn't snap it
  // shut mid-transition.
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        containerRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Falls back to the plain link if the featured list failed to load (or is
  // still loading before mount ever completes) — never shows an empty panel.
  if (items && items.length === 0) {
    return (
      <a href={basePath} className="relative whitespace-nowrap text-sm font-light uppercase tracking-[0.14px] text-black">
        {label}
        <span className="absolute bottom-[-14px] left-0 h-1.5 w-full rounded-t-[10px] bg-[#2a9d8f]" />
      </a>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeSoon();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex items-center gap-1.5 whitespace-nowrap text-sm font-light uppercase tracking-[0.14px] text-black"
      >
        {label}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M1 2.5 4 5.5 7 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute bottom-[-14px] left-0 h-1.5 w-full rounded-t-[10px] bg-[#2a9d8f]" />
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-[calc(100%+18px)] z-20 w-72 rounded-xl border border-black/5 bg-white p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.28)] transition-all duration-200 ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
        }`}
      >
        {items === null ? (
          <div className="space-y-1 p-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : (
          <>
            {items.map((item) => {
              const isCurrent = pathname === `${basePath}/${item.slug}`;
              return (
                <a
                  key={item.slug}
                  href={`${basePath}/${item.slug}`}
                  role="menuitem"
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm normal-case tracking-normal transition-colors hover:bg-[#e3efec] hover:text-black ${
                    isCurrent ? 'font-semibold text-black' : 'font-medium text-[#3a403e]'
                  }`}
                >
                  {item.title}
                  {isCurrent && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2a9d8f]" />}
                </a>
              );
            })}
            <div className="my-1.5 h-px bg-gray-100" />
            <a
              href={basePath}
              role="menuitem"
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold normal-case tracking-normal text-[#2a9d8f]"
            >
              View all {label.toLowerCase()}
              <span aria-hidden>→</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
