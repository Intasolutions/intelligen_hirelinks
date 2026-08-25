'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PillButton } from '../PillButton';
import { GrowMedLinkLogo } from './GrowMedLinkLogo';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'SERVICES', href: '/services' },
  { label: 'Programs', href: '/programs' },
  { label: 'BLOG', href: '/blog' },
];

const PARTNER_LINKS = [
  { id: 'intelligen', label: 'Intelligen', href: 'https://intelligenoverseas.com', logo: '/images/home/intelligen-logo.png', logoWidth: 110 },
  { id: 'growmedlink', label: 'GrowMedLink', href: 'https://growmedlink.com' },
];

// "/" only matches the homepage itself; every other route link also
// highlights on its own subpages (e.g. "/services" stays active on
// "/services/placement-support"), since exact-match alone would drop the
// highlight the moment a visitor is on any detail page under that section.
function isNavLinkActive(href: string, pathname: string) {
  if (!href.startsWith('/')) return false;
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function ArrowUpRight() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded bg-[#2a9d8f]">
      <Image src="/images/home/arrow-up-right.svg" alt="" width={10} height={10} />
    </span>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative px-3 py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3 rounded-full bg-white px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-gray-800 transition-colors active:bg-gray-100"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="14" viewBox="0 0 22 16" fill="none" aria-hidden>
              <path d="M0 1H22M0 8H22M0 15H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <Link href="/" className="relative h-9 w-9 shrink-0">
          <Image src="/images/home/hirelinks-logo.png" alt="Hirelinks" fill className="object-contain" priority />
        </Link>

        <PillButton href="/contact" arrow={false} className="shrink-0 text-xs">
          Contact
        </PillButton>
      </div>

      <div
        className={`absolute inset-x-3 top-full z-50 origin-top overflow-hidden rounded-2xl bg-white shadow-[0_16px_32px_rgba(0,0,0,0.16)] transition-all duration-300 ease-out ${
          open ? 'max-h-[80vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-4 pb-2 pt-3">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`relative py-3.5 text-sm font-medium uppercase tracking-[0.14px] text-black transition-colors active:text-[#2a9d8f] ${
                i !== 0 ? 'border-t border-gray-100' : ''
              }`}
            >
              {link.label}
              {isNavLinkActive(link.href, pathname) && (
                <span className="absolute bottom-3 left-0 h-1 w-6 rounded-full bg-[#2a9d8f]" />
              )}
            </a>
          ))}
        </nav>

        <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Our Partners
          </p>
          <div className="flex flex-col gap-2">
            {PARTNER_LINKS.map((partner) => (
              <a
                key={partner.id}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow active:shadow-none"
              >
                {partner.id === 'growmedlink' ? (
                  <GrowMedLinkLogo />
                ) : (
                  <div className="relative h-6 shrink-0" style={{ width: partner.logoWidth }}>
                    <Image src={partner.logo!} alt={partner.label} fill className="object-contain object-left" />
                  </div>
                )}
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
