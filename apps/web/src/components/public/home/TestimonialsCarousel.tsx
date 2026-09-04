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
  /** ISO 3166-1 alpha-2 code, lowercase — resolved via the flag-icons package (fi fi-{countryCode}). */
  countryCode?: string;
}

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
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors sm:h-11 sm:w-11 ${
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

const DEFAULT_DESCRIPTION =
  'At Intelligen Hirelinks, we connect nurses with trusted career opportunities and support them throughout their journey. Hear from nurses who trusted us to take the next step in their careers.';

export function TestimonialsCarousel({
  testimonials,
  description = DEFAULT_DESCRIPTION,
}: {
  testimonials: Testimonial[];
  /** Overrides the intro paragraph under the heading — defaults to the homepage's copy. */
  description?: string;
}) {
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
    <section className="relative w-full overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-24">
      <div className="relative mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-start gap-2">
          <div className="relative mt-1 h-4 w-[18px] shrink-0 sm:mt-1.5 sm:h-[18px] sm:w-[20px] lg:mt-2.5 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-xl font-bold leading-tight text-black sm:text-2xl md:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            <span className="text-black">What Our</span>{' '}
            <span className="text-[#2a9d8f]">Candidates Say</span>
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1} className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-black sm:mt-6 lg:mt-8 lg:text-lg">
          {description}
        </FadeInWhenVisible>

        {/* Main content: 3 equal columns — quote+rating, photo, reviewer info.
            The nav controls + dots live at the top of column 3, directly
            above the avatar/name block, so there's no dead space between the
            intro and the row. The "TESTIMONIALS" watermark sits behind the
            whole row (z-0), traced from Figma: League Gothic Regular, linear
            gradient fill from #2A9D8F @31% opacity (top) to #FFFFFF @0%
            opacity (bottom), spanning exactly edge-to-edge of the container
            (see FitTextWatermark for how the font-size is computed to fit). */}
        <div className="relative mt-6 sm:mt-8 lg:mt-10">
          <FitTextWatermark
            text="TESTIMONIALS"
            wrapperClassName="pointer-events-none absolute inset-x-0 top-1/2 z-0 w-full -translate-y-1/2 overflow-hidden text-center leading-none"
            textClassName="inline-block whitespace-nowrap bg-gradient-to-b from-[#2a9d8f]/[.31] to-white/0 bg-clip-text font-normal leading-none text-transparent"
            style={{ fontFamily: 'var(--font-league-gothic), sans-serif' }}
          />

          {/* z-10 static grid — only its contents cross-fade per testimonial
              (see AnimatePresence below); the nav controls + dots here are
              plain, non-animated, and never re-mount when the index changes. */}
          <div className="relative z-10 grid grid-cols-1 items-end gap-6 text-center sm:gap-8 lg:grid-cols-3 lg:gap-10 lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={active._id}
                className="order-2 mx-auto flex w-full max-w-sm flex-col lg:order-1 lg:mx-0 lg:max-w-none"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div className="flex justify-center lg:justify-start">
                  <StarRow rating={active.rating} />
                </div>
                {/* Fixed height, clearly shorter than the photo — clamped to
                    a set number of lines (10 at desktop, per spec) with a
                    "..." ellipsis when the review runs longer than that.
                    Fewer lines on small screens where the card itself is
                    narrower/shorter, so the clamp still fits inside it.
                    min-height matches each breakpoint's line-clamp cap, so a
                    short review reserves the same space as a long one and
                    the row doesn't jump in height between testimonials. */}
                <p className="mt-3 line-clamp-6 min-h-[116px] font-sans text-sm italic leading-snug text-black sm:mt-4 sm:line-clamp-8 sm:min-h-[154px] lg:min-h-[220px] lg:line-clamp-[10] lg:text-base">
                  {active.reviewComment}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={active._id}
                className="relative order-1 mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#ececec] sm:max-w-[340px] lg:order-2 lg:mx-auto lg:max-w-[420px]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {active.customerPhoto?.url ? (
                  <Image src={active.customerPhoto.url} alt={active.customerName} fill className="object-contain" />
                ) : (
                  <div className="h-full w-full bg-[#ececec]" />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Column 3: fixed height matching the photo (column 2), so its
                top edge lines up exactly with the photo/watermark's top. Nav
                controls + dots are pinned to the top and never animate; only
                the avatar/name block below them cross-fades per testimonial. */}
            <div className="order-3 mx-auto flex w-full max-w-[280px] flex-col items-center justify-between gap-4 sm:max-w-[340px] sm:gap-6 lg:order-3 lg:aspect-square lg:max-w-none lg:items-end">
              {/* On mobile/tablet the nav+dots sit AFTER the avatar/name
                  block (order-2); at lg+ they swap back to sitting above it
                  (order-1), pinned to the top of the fixed-height column. */}
              <div className="order-2 flex flex-col items-center gap-2 sm:gap-3 lg:order-1 lg:items-end">
                <div className="flex items-center gap-2 sm:gap-3">
                  <NavButton direction="prev" onClick={() => goTo(index - 1)} />
                  <NavButton direction="next" onClick={() => goTo(index + 1)} />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 lg:justify-end">
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={active._id}
                  className="order-1 flex items-center gap-3 lg:order-2 lg:self-start"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#ececec] sm:h-12 sm:w-12">
                    {active.customerPhoto?.url && (
                      <Image src={active.customerPhoto.url} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-sans text-sm font-semibold text-black sm:text-base">{active.customerName}</p>
                    {active.country && (
                      <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-[#818181] sm:text-sm">
                        {active.countryCode && <span className={`fi fi-${active.countryCode.toLowerCase()} rounded-sm`} />}
                        {active.country}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
