'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMessageForPath, buildWhatsAppLink } from '../../lib/whatsapp-messages';
import { useWhatsAppOverride } from './WhatsAppMessageContext';

// WhatsApp's own brand greens — deliberately not the site teal, so the
// button reads instantly as "this opens WhatsApp" the way users expect.
const GREEN = '#25D366';
const GREEN_DARK = '#128C7E';

function WhatsAppIcon({ size = 30 }: { size?: number }) {
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
  const [showBubble, setShowBubble] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Let the page settle before the button springs in.
    const inTimer = setTimeout(() => setVisible(true), 500);
    // Then, once, invite the click with a self-dismissing chat bubble —
    // mimics how real WhatsApp widgets nudge first-time visitors.
    const bubbleInTimer = setTimeout(() => setShowBubble(true), 1800);
    const bubbleOutTimer = setTimeout(() => setShowBubble(false), 7000);
    return () => {
      clearTimeout(inTimer);
      clearTimeout(bubbleInTimer);
      clearTimeout(bubbleOutTimer);
    };
  }, []);

  // Hide entirely if no number is configured in settings — better than
  // linking to a broken/empty wa.me URL.
  if (!number) return null;

  const message = override ?? getMessageForPath(pathname ?? '/');
  const href = buildWhatsAppLink(number, message);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Speech-bubble teaser */}
      <div
        role="status"
        className={`whatsapp-bubble max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm text-gray-700 shadow-xl ring-1 ring-black/5 transition-all duration-300 ease-out ${
          showBubble && !hovering
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setShowBubble(false)}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-600 shadow hover:bg-gray-300"
        >
          ✕
        </button>
        <p className="font-semibold text-gray-900">Need help? 👋</p>
        <p className="mt-0.5 text-gray-500">Chat with us on WhatsApp — we usually reply within minutes.</p>
      </div>

      {/* FAB + hover tooltip */}
      <div className="relative flex items-center">
        <span
          role="tooltip"
          className={`whatsapp-tooltip pointer-events-none absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#111b21] px-3.5 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ease-out ${
            hovering ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
          }`}
        >
          Chat with us
          <span className="whatsapp-tooltip-tail absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-[#111b21]" aria-hidden />
        </span>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => setShowBubble(false)}
          className={`whatsapp-fab group relative flex h-16 w-16 items-center justify-center rounded-full text-white transition-transform duration-300 ${
            visible ? 'whatsapp-pop scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <span className="whatsapp-orbit absolute -inset-1 rounded-full" aria-hidden />
          <span className="whatsapp-ring absolute inset-0 rounded-full" aria-hidden />
          <span className="whatsapp-ring whatsapp-ring-delay absolute inset-0 rounded-full" aria-hidden />
          <span className="whatsapp-core relative z-10 flex h-full w-full items-center justify-center rounded-full">
            <WhatsAppIcon />
          </span>
        </a>
      </div>

      <style jsx>{`
        .whatsapp-core {
          background: radial-gradient(circle at 30% 25%, ${GREEN} 0%, ${GREEN_DARK} 100%);
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .whatsapp-fab:hover .whatsapp-core {
          transform: scale(1.06);
          box-shadow: 0 12px 32px rgba(37, 211, 102, 0.65);
        }
        .whatsapp-fab:active .whatsapp-core {
          transform: scale(0.94);
        }
        .whatsapp-fab:hover {
          transform: translateY(-3px);
        }
        .whatsapp-pop {
          animation: whatsapp-spring 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .whatsapp-fab :global(svg) {
          transition: transform 0.35s ease;
        }
        .whatsapp-fab:hover :global(svg) {
          transform: rotate(-10deg) scale(1.1);
        }

        /* Signature touch: a conic-gradient halo that stays invisible at
           rest and spins into view on hover, like a glowing ring being
           traced around the button rather than a static glow appearing. */
        .whatsapp-orbit {
          background: conic-gradient(from 0deg, transparent 0%, ${GREEN} 15%, transparent 35%, transparent 65%, ${GREEN} 85%, transparent 100%);
          opacity: 0;
          transform: rotate(0deg) scale(0.85);
          filter: blur(2px);
          transition: opacity 0.4s ease, transform 0.6s ease;
        }
        .whatsapp-fab:hover .whatsapp-orbit {
          opacity: 0.9;
          transform: rotate(360deg) scale(1);
          animation: whatsapp-orbit-spin 3s linear infinite;
        }

        .whatsapp-ring {
          background: ${GREEN};
          animation: whatsapp-pulse 2.6s ease-out infinite;
        }
        .whatsapp-ring-delay {
          animation-delay: 1.3s;
        }
        .whatsapp-bubble {
          position: relative;
        }
        .whatsapp-tooltip-tail {
          border-width: 7px;
        }

        @keyframes whatsapp-spring {
          0% {
            transform: scale(0) rotate(-15deg);
          }
          60% {
            transform: scale(1.12) rotate(3deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes whatsapp-pulse {
          0% {
            opacity: 0.55;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.9);
          }
        }
        @keyframes whatsapp-orbit-spin {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .whatsapp-ring,
          .whatsapp-pop,
          .whatsapp-orbit,
          .whatsapp-fab :global(svg) {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
