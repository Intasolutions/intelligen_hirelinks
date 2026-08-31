'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMessageForPath, buildWhatsAppLink } from '../../lib/whatsapp-messages';
import { useWhatsAppOverride } from './WhatsAppMessageContext';

const TEAL = '#2a9d8f';
const TEAL_HOVER = '#248276';

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 11.98c0 1.88.52 3.63 1.42 5.13L2 22l5.02-1.38a10 10 0 0 0 4.99 1.33h.01c5.52 0 10-4.48 10-9.97C22.02 6.48 17.54 2 12.02 2Zm0 18.18h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.98.82.8-2.9-.2-.3a8.19 8.19 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.24 8.24Z" />
    </svg>
  );
}

interface WhatsAppButtonProps {
  /** Company WhatsApp number, e.g. from site settings (`companyWhatsapp`). */
  number?: string | null;
}

export function WhatsAppButton({ number }: WhatsAppButtonProps) {
  const pathname = usePathname();
  const override = useWhatsAppOverride();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Slight delay so the CTA slides in after the page has settled, rather
    // than fighting for attention during first paint.
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Hide entirely if no number is configured in settings — better than
  // linking to a broken/empty wa.me URL.
  if (!number) return null;

  const message = override ?? getMessageForPath(pathname ?? '/');
  const href = buildWhatsAppLink(number, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`whatsapp-cta group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full text-white shadow-lg transition-all duration-300 ease-out sm:bottom-6 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ backgroundColor: TEAL }}
    >
      <span className="whatsapp-cta-ring absolute inset-0 rounded-full" style={{ backgroundColor: TEAL }} aria-hidden />
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <WhatsAppIcon />
      </span>
      <span
        className={`relative overflow-hidden whitespace-nowrap pr-5 text-sm font-medium transition-all duration-300 ease-out ${
          expanded ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0 sm:max-w-0'
        }`}
      >
        Chat with us
      </span>

      <style jsx>{`
        .whatsapp-cta:hover {
          background-color: ${TEAL_HOVER} !important;
        }
        .whatsapp-cta-ring {
          animation: whatsapp-pulse 2.4s ease-out infinite;
          animation-delay: 2s;
        }
        @keyframes whatsapp-pulse {
          0% {
            opacity: 0.45;
            transform: scale(1);
          }
          70% {
            opacity: 0;
            transform: scale(1.6);
          }
          100% {
            opacity: 0;
            transform: scale(1.6);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .whatsapp-cta-ring {
            animation: none;
          }
        }
      `}</style>
    </a>
  );
}
