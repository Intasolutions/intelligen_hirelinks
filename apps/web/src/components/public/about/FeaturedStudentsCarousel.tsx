'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

export interface PlacedStudent {
  _id: string;
  name: string;
  photo?: { url: string; publicId: string };
  program?: string;
  country?: string;
  /** ISO 3166-1 alpha-2 code, lowercase — resolved via the flag-icons package (fi fi-{countryCode}). */
  countryCode?: string;
}

const AUTOPLAY_INTERVAL_MS = 5000;

const INTRO =
  'T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse';

function StudentPhoto({
  student,
  isActive,
  // Vertical stagger position within the visible row, 0-indexed from the
  // left — even positions sit lower, odd positions sit higher, per the
  // reference screenshot's zigzag arrangement. The row's own `items-end`
  // provides the "lower" baseline; raised positions get a negative
  // translate-y on top of that shared baseline.
  isRaised,
  // The two end photos are only half-width (and clipped by the row's own
  // overflow-hidden) so they peek in from off-screen instead of sitting
  // flush inside the viewport edge — the "half image at each end" look.
  isHalf,
  onClick,
}: {
  student: PlacedStudent;
  isActive: boolean;
  isRaised: boolean;
  isHalf: boolean;
  onClick: () => void;
}) {
  // Widths are percentages of the row's own full (viewport) width, not cqw
  // off a padded ancestor, so the whole row sums well under 100%, leaving
  // room for justify-between's gaps and for the active photo's extra width
  // without ever overflowing. Below sm: there are only 5 photos (2 of them
  // half-peeks) instead of 7, so each one gets a bigger un-prefixed share;
  // sm: and up switch to the smaller values needed to fit all 7. Height is
  // h-full (matching the row's own fixed height, set on the parent — see
  // FeaturedStudentsCarousel) instead of an aspect-ratio, so a photo's
  // active/inactive width transition never changes its own or the row's
  // height — object-cover on the image crops to fit whatever box results.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={student.name}
      className={`relative h-full shrink-0 overflow-hidden rounded-2xl bg-[#ececec] transition-all duration-500 ease-out ${
        isRaised ? '-translate-y-[4vw] sm:-translate-y-10 lg:-translate-y-14' : ''
      } ${
        isActive
          ? 'w-[28%] sm:w-[16%]'
          : isHalf
            ? 'w-[10%] opacity-60 grayscale sm:w-[6%]'
            : 'w-[20%] opacity-60 grayscale sm:w-[11%]'
      }`}
    >
      {student.photo?.url ? (
        <Image
          src={student.photo.url}
          alt={student.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 330px, (min-width: 640px) 250px, 33vw"
        />
      ) : (
        <div className="h-full w-full bg-[#ececec]" />
      )}
    </button>
  );
}

export function FeaturedStudentsCarousel({ students }: { students: PlacedStudent[] }) {
  const [index, setIndex] = useState(0);
  // Below the sm: breakpoint (640px), 5 photos read clearly; at sm: and up
  // there's room for 7 (5 full + 2 half "peek" ends). Tailwind breakpoints
  // can't change how many array items get mapped, so the count itself is
  // tracked in JS via a matchMedia listener, mirroring the same 640px cutoff
  // Tailwind's own `sm:` uses.
  const [isCompact, setIsCompact] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setIsCompact(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // documentElement.clientWidth excludes the scrollbar gutter, unlike
  // `100vw`/w-screen — see the full-bleed row below for why that matters.
  // Starts as '100vw' so SSR/first paint isn't blank while this measures.
  const [viewportWidth, setViewportWidth] = useState<string | number>('100vw');

  useEffect(() => {
    const update = () => setViewportWidth(document.documentElement.clientWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (students.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % students.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [students.length, index]);

  if (students.length === 0) return null;

  const active = students[index];
  const goTo = (i: number) => setIndex(((i % students.length) + students.length) % students.length);

  // At sm: and up, show 3 neighbors on each side (7 total). Below sm:, show
  // only 2 neighbors on each side (5 total) so each one is bigger and reads
  // clearly on a small screen — the outermost of whichever count is showing
  // is always the half-cropped "peek" photo (see isHalf below), never a
  // full photo flush against the edge.
  const visibleCount = Math.min(students.length, isCompact ? 5 : 7);
  const half = Math.floor(visibleCount / 2);
  const visibleIndexes = Array.from({ length: visibleCount }, (_, i) => {
    const offset = i - half;
    return ((index + offset) % students.length + students.length) % students.length;
  });

  return (
    <section className="w-full bg-white py-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <FadeInWhenVisible className="flex items-center gap-2">
          <span className="font-sans text-lg font-bold text-[#2a9d8f] sm:text-xl">//</span>
          <p className="font-display-rounded text-xl font-bold leading-tight text-black sm:text-2xl md:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            <span className="text-black">Meet our Fabulous Students</span>{' '}
            <span className="text-[#2a9d8f]">Who Placed Well</span>
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1} className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-black sm:mt-6 lg:mt-8 lg:text-lg">
          {INTRO}
        </FadeInWhenVisible>

      </div>

      {/* Full viewport-width bleed, breaking out of both the section's own
          px-4/sm:px-6/lg:px-10 padding and the max-w-[1360px] container
          above/below it. `100vw` (the old `w-screen`) is 1% of the INITIAL
          CONTAINING BLOCK width, which includes the scrollbar gutter — on
          any desktop page with a vertical scrollbar (this one, being taller
          than the viewport), that's wider than the actually-visible page
          area by exactly the scrollbar's width, so `left-1/2
          -translate-x-1/2 w-screen` was overshooting the right edge and
          forcing a horizontal scrollbar into existence just to reach it.
          There's no CSS unit that excludes the scrollbar reliably across
          browsers, so `vw` is measured in JS via document.documentElement's
          actual clientWidth (which does exclude it) instead. */}
      <div
        className="relative mt-6 -translate-x-1/2 overflow-x-hidden pt-[4vw] sm:mt-14 sm:pt-10 lg:pt-14"
        style={{ left: '50%', width: viewportWidth }}
      >
        {/* Fixed height (matching the active photo's own rendered height —
            the tallest possible child) instead of letting the row's height
            follow whichever photo is currently tallest. Without this, the
            500ms width transition on the photo becoming/un-becoming active
            makes the row's own height ride along with it every cycle,
            visibly jittering everything below the carousel up and down in
            sync. Anchoring photos to the bottom of this fixed box means the
            in-flight resize animation is now fully contained inside a box
            that itself never moves. */}
        <div className="flex h-[36vw] max-h-[220px] items-end justify-between sm:h-[21vw] sm:max-h-[320px] lg:max-h-[420px]">
          {visibleIndexes.map((i, position) => (
            <StudentPhoto
              key={students[i]._id}
              student={students[i]}
              isActive={i === index}
              isRaised={position % 2 === 1}
              isHalf={position === 0 || position === visibleIndexes.length - 1}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* Fixed min-height reserves room for both lines (name + country) up
          front, and AnimatePresence uses layout-preserving cross-fade
          (position: absolute on the exiting element via `mode="popLayout"`
          isn't needed here since both name and country are single-line and
          always occupy the same two fixed rows) so switching between
          students of different name/country text length never changes this
          block's own height and never shifts anything below it. */}
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mt-3 flex min-h-[52px] max-w-xs flex-col items-center justify-start text-center sm:mt-8 sm:min-h-[60px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <p className="font-sans text-base font-bold text-black sm:text-lg">{active.name}</p>
              <p className="mt-1 flex min-h-[20px] items-center justify-center gap-1.5 font-sans text-sm text-[#5c5c5c]">
                {active.country && (
                  <>
                    {active.countryCode && <span className={`fi fi-${active.countryCode.toLowerCase()} rounded-sm`} />}
                    {active.country}
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
