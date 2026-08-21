'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

export interface Testimonial {
  _id: string;
  customerName: string;
  customerPhoto?: { url: string; publicId: string };
  rating: number;
  reviewComment: string;
  country?: string;
  /** ISO 3166-1 alpha-2 code, lowercase — resolves to /images/flags/{countryCode}.svg. */
  countryCode?: string;
}

// Only these codes actually have a flag SVG in public/images/flags/ today —
// anything else (e.g. a phone dialing code entered by mistake) is skipped
// instead of rendering a broken image icon.
const AVAILABLE_FLAG_CODES = new Set(['in', 'br', 'au', 'us']);

const AUTOPLAY_INTERVAL_MS = 6000;

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-[#2a9d8f]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill={i < rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={i < rating ? 0 : 1.5}>
          <path d="M12 2.5 14.85 8.4l6.5.95-4.7 4.58 1.11 6.47L12 17.3l-5.76 3.1 1.11-6.47L2.65 9.35l6.5-.95L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

// Measures its own container width and the text's natural rendered width at a
// fixed reference font-size, then scales the font-size so the text spans
// exactly edge-to-edge — same technique PillButton uses to size its label,
// avoids guessing a px/vw value against a condensed display font's real
// glyph widths (which was overflowing/underfilling on every previous guess).
// `wrapperClassName` handles positioning; `textClassName` (gradient/clip/etc.)
// is applied directly to the element that actually contains the text glyphs,
// since bg-clip-text only works on the element with the text content itself.
function FitTextWatermark({
  text,
  wrapperClassName,
  textClassName,
  style,
}: {
  text: string;
  wrapperClassName?: string;
  textClassName?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const REFERENCE_SIZE = 100;
  const [fontSize, setFontSize] = useState(REFERENCE_SIZE);

  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const naturalWidth = textRef.current.offsetWidth;
      if (naturalWidth > 0) {
        setFontSize((containerWidth / naturalWidth) * REFERENCE_SIZE);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    // League Gothic loads async (next/font display:'swap') — the very first
    // measurement can happen against the fallback font's metrics, which are
    // narrower/wider than the real one, so the fit would be slightly off
    // until a resize happened to trigger a re-measure. Re-measure once the
    // real font finishes loading so it's correct on first paint.
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [text]);

  return (
    <div ref={containerRef} className={wrapperClassName}>
      <span
        ref={textRef}
        className="absolute -z-50 whitespace-nowrap opacity-0"
        style={{ fontSize: REFERENCE_SIZE, fontFamily: style?.fontFamily }}
        aria-hidden
      >
        {text}
      </span>
      <span className={textClassName} style={{ ...style, fontSize }}>
        {text}
      </span>
    </div>
  );
}

function NavButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isNext = direction === 'next';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? 'Next testimonial' : 'Previous testimonial'}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
        isNext ? 'bg-[#2a9d8f] text-white hover:bg-[#238478]' : 'bg-[#e2e2e2] text-[#9a9a9a] hover:bg-[#d5d5d5]'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d={isNext ? 'M4 12 12 4M12 4H5M12 4V11' : 'M12 4 4 12M4 12H11M4 12V5'}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [testimonials.length, index]);

  if (testimonials.length === 0) return null;

  const active = testimonials[index];
  const goTo = (i: number) => setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);

  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-16 lg:px-10 lg:py-24">
      <div className="relative mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-start gap-2">
          <div className="relative mt-1.5 h-[18px] w-[20px] shrink-0 lg:mt-2.5 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            <span className="text-black">Trusted by Millions of Users</span>{' '}
            <span className="text-[#2a9d8f]">Globally</span>
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1} className="mt-6 max-w-2xl font-sans text-sm leading-relaxed text-black lg:mt-8 lg:text-lg">
          T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse
        </FadeInWhenVisible>

        {/* Nav controls, with the dot progress indicator underneath, top-right on desktop. */}
        <div className="relative mt-8 flex flex-col items-end gap-3 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:max-w-[240px]">
          <div className="flex items-center gap-3">
            <NavButton direction="prev" onClick={() => goTo(index - 1)} />
            <NavButton direction="next" onClick={() => goTo(index + 1)} />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {testimonials.map((t, i) => (
              <button
                key={t._id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  height: 8,
                  width: i === index ? 20 : 8,
                  backgroundColor: i === index ? '#2a9d8f' : '#d9d9d9',
                }}
              />
            ))}
          </div>
        </div>

        {/* Main content: 3 equal columns — quote+rating, photo, reviewer info.
            The "TESTIMONIALS" watermark sits behind this row (z-0), traced
            from Figma: League Gothic Regular, linear gradient fill from
            #2A9D8F @31% opacity (top) to #FFFFFF @0% opacity (bottom),
            spanning exactly edge-to-edge of the container (see
            FitTextWatermark for how the font-size is computed to fit). */}
        <div className="relative mt-14 lg:mt-16">
          <FitTextWatermark
            text="TESTIMONIALS"
            wrapperClassName="pointer-events-none absolute inset-x-0 top-1/2 z-0 w-full -translate-y-1/2 overflow-hidden text-center leading-none"
            textClassName="inline-block whitespace-nowrap bg-gradient-to-b from-[#2a9d8f]/[.31] to-white/0 bg-clip-text font-normal leading-none text-transparent"
            style={{ fontFamily: 'var(--font-league-gothic), sans-serif' }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active._id}
              className="relative z-10 grid grid-cols-1 items-center gap-8 text-center lg:grid-cols-3 lg:items-end lg:gap-10 lg:text-left"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="order-2 mx-auto max-w-sm lg:order-1 lg:mx-0 lg:max-w-none">
                <div className="flex justify-center lg:justify-start">
                  <StarRow rating={active.rating} />
                </div>
                <p className="mt-4 font-sans text-base italic leading-relaxed text-black lg:text-lg">
                  {active.reviewComment}
                </p>
              </div>

              <div className="relative order-1 mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl lg:order-2 lg:mx-auto">
                {active.customerPhoto?.url ? (
                  <Image src={active.customerPhoto.url} alt={active.customerName} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-[#ececec]" />
                )}
              </div>

              <div className="order-3 flex items-center justify-center gap-3 lg:justify-start">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#ececec]">
                  {active.customerPhoto?.url && (
                    <Image src={active.customerPhoto.url} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-sans text-base font-semibold text-black">{active.customerName}</p>
                  {active.country && (
                    <p className="mt-0.5 flex items-center justify-center gap-1.5 font-sans text-sm text-[#818181] lg:justify-start">
                      {active.countryCode && AVAILABLE_FLAG_CODES.has(active.countryCode.toLowerCase()) && (
                        <span className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
                          <Image src={`/images/flags/${active.countryCode.toLowerCase()}.svg`} alt="" fill className="object-cover" />
                        </span>
                      )}
                      {active.country}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
