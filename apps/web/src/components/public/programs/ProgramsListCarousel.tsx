'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

export interface ProgramListItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  primaryImage?: { url: string; publicId: string };
}

function ProgramCard({
  program,
  isActive,
  onActivate,
  cardRef,
}: {
  program: ProgramListItem;
  isActive: boolean;
  onActivate: () => void;
  cardRef: (el: HTMLAnchorElement | null) => void;
}) {
  return (
    <FadeInWhenVisible>
      {/* The whole card is a real link now (previously only the "View
          Details" pill navigated; the rest of the card just toggled the
          highlight and went nowhere on click) — onMouseEnter/onFocus still
          drive the hover highlight, and clicking anywhere, including the
          decorative pill, follows the link to the program page. The pill
          keeps its own look but is a span now, not a nested <a>, since an
          anchor can't contain another interactive anchor. */}
      <a
        ref={cardRef}
        href={`/programs/${program.slug}`}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        className={`relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl p-5 outline-none transition-[transform,box-shadow,color] duration-500 ease-out hover:-translate-y-1 hover:shadow-xl active:bg-black/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 lg:p-7 ${
          isActive ? 'text-white' : 'text-black'
        }`}
        style={{
          background: isActive ? 'linear-gradient(to right, #0D796C, #2A9D8F)' : '#f5f5f5',
          transition: 'background 600ms ease, transform 500ms ease-out, box-shadow 500ms ease-out, color 500ms ease',
        }}
      >
        {/* Decorative background art on the active card only — the exact
            asset used elsewhere for this "highlighted card" treatment
            (CoreValuesSection/ServiceProcessSection's inline squiggle),
            here supplied as a standalone SVG file instead. */}
        {isActive && (
          <Image
            src="/images/programs/bg-aimattion.svg"
            alt=""
            fill
            className="pointer-events-none object-cover opacity-60"
            aria-hidden
          />
        )}

        <div className="relative flex flex-1 flex-col gap-2">
          <p className="font-display-rounded text-lg font-bold leading-snug sm:text-xl lg:text-2xl">{program.title}</p>
          <p className={`max-w-lg font-sans text-sm leading-relaxed sm:text-base ${isActive ? 'text-white/80' : 'text-black/60'}`}>
            {program.shortDescription}
          </p>
          <div className="mt-1">
            <PillButton
              href={`/programs/${program.slug}`}
              interactive={false}
              bgColor={isActive ? '#ffffff' : '#000000'}
              textColor={isActive ? '#2a9d8f' : '#ffffff'}
            >
              View Details
            </PillButton>
          </div>
        </div>

        {program.primaryImage?.url && (
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-[#ececec] sm:aspect-[4/3] sm:w-[34%] lg:w-[28%]">
            <Image
              src={program.primaryImage.url}
              alt={program.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 38vw, 100vw"
            />
          </div>
        )}
      </a>
    </FadeInWhenVisible>
  );
}

export function ProgramsListCarousel({ programs }: { programs: ProgramListItem[] }) {
  // Hover/tap makes a card active, same interaction pattern as
  // PopularServicesCarousel and ServiceProcessSection — first card active
  // on load.
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Mobile/tablet only (below lg, no hover): whichever card crosses the
  // vertical center of the viewport as the list scrolls becomes active
  // automatically — same scroll-spy as PopularServicesCarousel and
  // ServicesGrid on the homepage.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    if (mql.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = cardRefs.current.findIndex((el) => el === entry.target);
          if (i !== -1) setActiveIndex(i);
        }
      },
      { rootMargin: '-45% 0px -55% 0px', threshold: 0 }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [programs.length]);

  if (programs.length === 0) return null;

  return (
    // scroll-mt accounts for the fixed/sticky header (90px tall at lg:) so
    // the nav dropdown's "View all programs" anchor lands with this
    // section's heading clear of the header instead of tucked under it.
    <section id="listing" className="w-full overflow-x-hidden bg-white px-4 py-10 scroll-mt-24 sm:px-6 sm:py-14 lg:scroll-mt-[110px] lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center justify-center gap-2 text-center">
          <div className="relative h-[18px] w-5 shrink-0 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-2xl font-bold leading-tight sm:text-3xl lg:text-[42px]">
            <span className="text-black">Our</span> <span className="text-[#2a9d8f]">Programs</span>
          </p>
        </FadeInWhenVisible>

        <div className="mt-8 flex flex-col gap-5 sm:mt-10 lg:mt-12">
          {programs.map((program, i) => (
            <ProgramCard
              key={program._id}
              program={program}
              isActive={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
