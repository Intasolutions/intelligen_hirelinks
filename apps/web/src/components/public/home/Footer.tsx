'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type SVGProps } from 'react';
import type { SettingsInput } from '@hirelinks/contracts';
import { PillButton } from '../PillButton';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Programs', href: '/#programs' },
  { label: 'Blogs', href: '/blog' },
  { label: 'Contact Us', href: '/#contact' },
];

function IconCircle({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...rest}>
      {children}
    </svg>
  );
}

const SOCIAL_ICONS = {
  facebook: (p: SVGProps<SVGSVGElement>) => (
    <IconCircle {...p}>
      <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.35C16.22 4.31 15.27 4.23 14.16 4.23c-2.32 0-3.91 1.42-3.91 4.02v2.25H7.75v3h2.5V21h3.25Z" />
    </IconCircle>
  ),
  instagram: (p: SVGProps<SVGSVGElement>) => (
    <IconCircle {...p}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.51.5.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43C21.99 8.94 22 9.28 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.5.51-1.11.9-1.77 1.15-.64.25-1.37.42-2.43.47C15.06 21.99 14.72 22 12 22s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 3.24a6.76 6.76 0 1 0 0 13.52 6.76 6.76 0 0 0 0-13.52Zm0 2a4.76 4.76 0 1 1 0 9.52 4.76 4.76 0 0 1 0-9.52Zm6.9-2.14a1.58 1.58 0 1 1-3.16 0 1.58 1.58 0 0 1 3.16 0Z" />
    </IconCircle>
  ),
  linkedin: (p: SVGProps<SVGSVGElement>) => (
    <IconCircle {...p}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h.02v-6.4c0-3.13-.67-5.54-4.33-5.54-1.76 0-2.94.96-3.42 1.88h-.05V8.5H9.42V20h3.38v-5.7c0-1.5.28-2.95 2.14-2.95 1.83 0 1.86 1.71 1.86 3.05V20h3.64Z" />
    </IconCircle>
  ),
  twitter: (p: SVGProps<SVGSVGElement>) => (
    <IconCircle {...p}>
      <path d="M18.9 3H21.6l-5.83 6.66L22.7 21h-5.24l-4.1-5.36L8.66 21H5.94l6.24-7.13L4.3 3h5.37l3.71 4.9L18.9 3Zm-.92 16.4h1.46L7.09 4.52H5.53L17.98 19.4Z" />
    </IconCircle>
  ),
  youtube: (p: SVGProps<SVGSVGElement>) => (
    <IconCircle {...p}>
      <path d="M21.6 7.7a2.6 2.6 0 0 0-1.84-1.85C18.1 5.4 12 5.4 12 5.4s-6.1 0-7.76.45A2.6 2.6 0 0 0 2.4 7.7C2 9.37 2 12.85 2 12.85s0 3.48.4 5.15a2.6 2.6 0 0 0 1.84 1.85c1.66.45 7.76.45 7.76.45s6.1 0 7.76-.45a2.6 2.6 0 0 0 1.84-1.85c.4-1.67.4-5.15.4-5.15s0-3.48-.4-5.15ZM10 15.9V9.8l5.45 3.05L10 15.9Z" />
    </IconCircle>
  ),
  threads: (p: SVGProps<SVGSVGElement>) => (
    <IconCircle {...p}>
      <path d="M12.03 2c-4.2 0-7.02 2.1-7.34 6h2.35c.3-2.68 2.02-3.98 4.9-3.98 3.2 0 4.9 1.6 4.9 4.03 0 1.62-.7 2.7-2.1 3.3.1-.42.15-.87.15-1.34 0-2.5-1.86-4.06-4.6-4.06-2.85 0-4.85 1.72-4.85 4.4 0 2.72 2 4.4 5 4.4 1.5 0 2.75-.42 3.7-1.16.5.65.75 1.43.75 2.32 0 2.15-1.85 3.4-4.7 3.4-3.4 0-5.7-1.75-5.9-4.6H1.9C2.15 19.4 5.7 22 10.9 22c4.55 0 7.75-2.15 7.75-5.9 0-1.72-.6-3.03-1.6-3.98 1.4-.9 2.15-2.3 2.15-4.13C19.2 4.35 16.35 2 12.03 2Zm.16 12.65c-1.9 0-2.95-.85-2.95-2.2 0-1.38 1.1-2.25 2.85-2.25 1.85 0 2.75.87 2.75 2.2 0 1.4-1 2.25-2.65 2.25Z" />
    </IconCircle>
  ),
} as const;

function LocationPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth={1.6}>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

function ChevronButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'next' ? 'Next location' : 'Previous location'}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e0e0e0] text-[#9a9a9a] transition-colors hover:border-[#2a9d8f] hover:text-[#2a9d8f]"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
          d={direction === 'next' ? 'M6 3l5 5-5 5' : 'M10 3 5 8l5 5'}
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function Footer({ settings }: { settings: SettingsInput | null }) {
  const addresses = settings?.addresses ?? [];
  const primaryIndex = Math.max(
    0,
    addresses.findIndex((a) => a.isPrimary)
  );
  const [addressIndex, setAddressIndex] = useState(primaryIndex);
  const activeAddress = addresses[addressIndex];

  const goToAddress = (i: number) => setAddressIndex(((i % addresses.length) + addresses.length) % addresses.length);

  const socialEntries = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[])
    .map((key) => ({ key, url: settings?.[key], Icon: SOCIAL_ICONS[key] }))
    .filter((entry): entry is { key: keyof typeof SOCIAL_ICONS; url: string; Icon: (typeof SOCIAL_ICONS)[keyof typeof SOCIAL_ICONS] } => !!entry.url);

  const companyName = settings?.companyName || 'Intelligen Hirelinks';
  const year = new Date().getFullYear();

  return (
    <div className="bg-gradient-to-b from-white to-[#e9e9e9] px-1 py-1 sm:px-1.5 sm:py-1.5 lg:px-2 lg:py-2">
      {/* No max-w cap here — the gap to the viewport edge should be exactly
          the small padding on the wrapper above, not that plus extra grey
          space left over from a width cap on top of it. */}
      <footer className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 gap-8 p-5 sm:p-6 lg:grid-cols-[0.8fr_1fr] lg:gap-6 lg:p-8">
          {/* Left: brand, blurb, CTA, socials. Spans both grid rows (this one
              and the watermark row below) so its stretched height matches the
              full card content height, not just the row-1 height next to the
              right column — otherwise `mt-auto` only had the shorter row-1
              height to push against, landing the icons above the watermark
              row instead of at the true bottom of the content, flush with
              where the copyright bar starts. */}
          <div className="flex h-full flex-col lg:row-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-8 w-10 shrink-0">
                <Image src="/images/home/hirelinks-logo.png" alt="" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold uppercase tracking-[0.5px] text-black">{companyName}</span>
            </Link>

            <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-[#6b6b6b]">
              T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse
            </p>

            <div className="mt-6">
              <PillButton href="/register" bgColor="#000000" textColor="#ffffff">
                Register Now!
              </PillButton>
            </div>

            {socialEntries.length > 0 && (
              <div className="mt-auto flex items-center gap-2 pt-8">
                {socialEntries.map(({ key, url, Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e5e5] text-black transition-colors hover:border-[#2a9d8f] hover:text-[#2a9d8f]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right: quick links + location/contact. Bordered on the left at
              lg, where it sits beside the brand column — this is also where
              the watermark row below is aligned to start from. */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:border-l lg:border-[#eee] lg:pl-8">
            <div>
              <p className="font-display-rounded text-2xl font-bold text-black">
                Quick <span className="text-[#2a9d8f]">Links</span>
              </p>
              <ul className="mt-5 space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="font-sans text-sm text-[#3a3a3a] transition-colors hover:text-[#2a9d8f]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-col gap-4">
              {activeAddress && (
                <div>
                  <div className="flex items-center gap-2">
                    <LocationPinIcon />
                    {addresses.length > 1 && (
                      <div className="ml-auto flex items-center gap-1.5">
                        <ChevronButton direction="prev" onClick={() => goToAddress(addressIndex - 1)} />
                        <ChevronButton direction="next" onClick={() => goToAddress(addressIndex + 1)} />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-line font-sans text-sm leading-relaxed text-[#3a3a3a]">
                    {activeAddress.address}
                  </p>
                </div>
              )}

              {settings?.companyEmail && (
                <a href={`mailto:${settings.companyEmail}`} className="flex items-center gap-2 font-sans text-sm text-[#3a3a3a] transition-colors hover:text-[#2a9d8f]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth={1.6}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {settings.companyEmail}
                </a>
              )}

              {settings?.companyPhone && (
                <a href={`tel:${settings.companyPhone}`} className="flex items-center gap-2 font-sans text-sm text-[#3a3a3a] transition-colors hover:text-[#2a9d8f]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth={1.6}>
                    <path d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.9c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1l-2 2.2Z" strokeLinejoin="round" />
                  </svg>
                  {settings.companyPhone}
                </a>
              )}
            </div>
          </div>

          {/* "HIRELINKS" watermark — a third child of this same grid, pinned
              to lg:col-start-2 so its left edge lands exactly on the border
              above (the same line the right column starts from), instead of
              a guessed 50% split that wouldn't necessarily match it. Row
              height is tight against the text's own cap-height (this font
              has no lowercase descenders to allow for), not padded out —
              cqw sizing lives on these inner divs, not the outermost one, so
              it scales with the (now column-width, not full-card-width)
              container rather than a fixed px guess that would drift out of
              proportion at other widths. */}
          <div className="relative w-full overflow-hidden lg:col-start-2" style={{ containerType: 'inline-size' }}>
            <div className="relative flex h-[14cqw] items-center overflow-hidden">
              <div
                className="absolute inset-0 flex items-center overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, #000 0%, transparent 88%)',
                  WebkitMaskImage: 'linear-gradient(to right, #000 0%, transparent 88%)',
                }}
              >
                <p
                  aria-hidden
                  className="pointer-events-none select-none whitespace-nowrap font-display-rounded text-[17cqw] font-bold uppercase leading-none text-[#e9e9e9]"
                >
                  Hirelinks
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-3 border-t border-[#eee] px-5 py-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p className="font-sans text-xs text-[#9a9a9a]">
            © {year} {companyName}. All Rights Reserved
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms-and-conditions" className="font-sans text-xs text-[#3a3a3a] transition-colors hover:text-[#2a9d8f]">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="font-sans text-xs text-[#3a3a3a] transition-colors hover:text-[#2a9d8f]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
