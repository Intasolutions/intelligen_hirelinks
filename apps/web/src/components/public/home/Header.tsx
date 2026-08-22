'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PillButton } from '../PillButton';
import { GrowMedLinkLogo } from './GrowMedLinkLogo';
import { MobileNav } from './MobileNav';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'Programs', href: '#programs' },
  { label: 'BLOG', href: '/blog' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-0 z-50 lg:sticky lg:border-b lg:border-white lg:bg-gradient-to-r lg:from-white lg:to-white/0 lg:to-[53%]">
      <div className="relative bg-transparent lg:hidden">
        <MobileNav />
      </div>

      <div className="mx-auto hidden h-[90px] max-w-[1440px] items-center justify-between px-6 lg:flex xl:px-[60px]">
        <Link href="/" className="flex items-end gap-2.5">
          <div className="relative h-10 w-[50px] shrink-0">
            <Image
              src="/images/home/hirelinks-logo.png"
              alt="Hirelinks"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[17.5px] font-bold uppercase tracking-[1.05px] text-[#2a9f90]">
              Hirelinks
            </span>
            <span className="font-normal text-[10px] tracking-[0.1px] text-[#0c78b8]">
              Powered by Intelligen
            </span>
          </div>
        </Link>

        <nav className="relative flex items-center gap-4 rounded-[84px] bg-white py-1.5 pl-[26px] pr-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)] xl:gap-9">
          {/* The two external partner links are the first things to go at the
              narrow end of lg (1024px) — with everything else, the nav needs
              ~970px and there's only ~740px to give it there, overflowing the
              page horizontally. They come back once xl (1280px) has the room. */}
          <a
            href="https://intelligenoverseas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 xl:flex"
          >
            <div className="relative h-6 w-[102px]">
              <Image
                src="/images/home/intelligen-logo.png"
                alt="Intelligen"
                fill
                className="object-contain"
              />
            </div>
            <span className="flex size-6 items-center justify-center rounded bg-[#2a9d8f]">
              <Image src="/images/home/arrow-up-right.svg" alt="" width={10} height={10} />
            </span>
          </a>

          <a
            href="https://growmedlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 xl:flex"
          >
            <GrowMedLinkLogo />
            <span className="flex size-6 items-center justify-center rounded bg-[#2a9d8f]">
              <Image src="/images/home/arrow-up-right.svg" alt="" width={10} height={10} />
            </span>
          </a>

          {NAV_LINKS.map((link) => {
            // Anchor links (e.g. "#services") target a section on the
            // homepage, not a route of their own — only real page routes
            // (starting with "/") can ever be the "current" page.
            const isActive = link.href.startsWith('/') && pathname === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative whitespace-nowrap text-sm uppercase tracking-[0.14px] text-black ${
                  isActive ? 'font-light' : 'font-medium'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-14px] left-0 h-1.5 w-full rounded-t-[10px] bg-[#2a9d8f]" />
                )}
              </a>
            );
          })}

          <PillButton href="#contact" arrow={false}>
            Contact
          </PillButton>
        </nav>
      </div>
    </header>
  );
}
