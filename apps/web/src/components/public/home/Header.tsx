import Image from 'next/image';
import Link from 'next/link';
import { PillButton } from '../PillButton';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'Programs', href: '#programs' },
  { label: 'BLOG', href: '/blog' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white bg-gradient-to-r from-white to-white/0 to-[53%]">
      <div className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-[60px]">
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
            <span className="text-[17px] font-bold uppercase tracking-wide text-[#2a9f90]">
              Hirelinks
            </span>
            <span className="text-[10px] tracking-wide text-[#0c78b8]">
              Powered by Intelligen
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-9 rounded-[84px] bg-white py-1.5 pl-[26px] pr-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
          <a
            href="https://intelligenoverseas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
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
            className="flex items-center gap-1.5"
          >
            {/* growmedlink-logo.png is a single stacked lockup (icon over wordmark); crop icon vs wordmark via oversized absolute image, matching the source Figma export */}
            <div className="relative h-6 w-6 shrink-0 overflow-hidden">
              <Image
                src="/images/home/growmedlink-logo.png"
                alt=""
                width={100}
                height={100}
                className="absolute left-[-42%] top-0 h-[195%] w-[184%] max-w-none object-contain"
              />
            </div>
            <div className="relative h-5 w-[136px] overflow-hidden">
              <Image
                src="/images/home/growmedlink-logo.png"
                alt="GrowMedLink"
                width={400}
                height={400}
                className="absolute left-0 top-[-374%] h-[729%] w-full max-w-none object-contain"
              />
            </div>
            <span className="flex size-6 items-center justify-center rounded bg-[#2a9d8f]">
              <Image src="/images/home/arrow-up-right.svg" alt="" width={10} height={10} />
            </span>
          </a>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative whitespace-nowrap text-sm font-medium uppercase tracking-wide text-black"
            >
              {link.label}
              {link.label === 'HOME' && (
                <span className="absolute -bottom-[18px] left-0 h-1.5 w-full rounded-t-[10px] bg-[#2a9d8f]" />
              )}
            </a>
          ))}

          <PillButton href="#contact" arrow={false}>
            Contact
          </PillButton>
        </nav>
      </div>
    </header>
  );
}
