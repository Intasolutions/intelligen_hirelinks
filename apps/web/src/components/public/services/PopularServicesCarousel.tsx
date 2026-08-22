'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

export interface PopularService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  primaryImage?: { url: string; publicId: string };
}

// Vertical blue-to-teal gradient, sampled directly from the Figma export
// (top #0090E8 -> bottom #2A9D8F, the sitewide brand teal) — applied to the
// row number in every row regardless of active state; only the heading text
// and photo mute/brighten between active and inactive.
function GradientNumber({ n }: { n: number }) {
  return (
    <p
      className="bg-gradient-to-b from-[#0090E8] to-[#2A9D8F] bg-clip-text font-display-rounded text-5xl font-bold leading-none text-transparent sm:text-6xl lg:text-7xl"
      aria-hidden
    >
      {n}
    </p>
  );
}

function ServiceRow({
  service,
  index,
  isActive,
  onActivate,
  imageOnRight,
}: {
  service: PopularService;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  imageOnRight: boolean;
}) {
  const photo = (
    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-[#ececec] transition-all duration-500 lg:w-[46%]">
      {service.primaryImage?.url && (
        <Image
          src={service.primaryImage.url}
          alt={service.title}
          fill
          className={`object-cover transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale'}`}
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
      )}
    </div>
  );

  const content = (
    <div className="flex flex-1 flex-col justify-center gap-4 py-2">
      <GradientNumber n={index + 1} />
      <p
        className={`font-display-rounded text-xl font-bold transition-colors duration-500 sm:text-2xl lg:text-3xl ${
          isActive ? 'text-black' : 'text-[#c2c2c2]'
        }`}
      >
        {service.title}
      </p>
      <p className="max-w-md font-sans text-sm leading-relaxed text-black sm:text-base">{service.shortDescription}</p>

      {/* Only rendered (not just hidden) while active, so it never occupies
          layout space or gets tab-focused on inactive rows. */}
      <div
        className={`grid transition-all duration-500 ease-out ${isActive ? 'mt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <PillButton href="/services" variant="solid" bgColor="#000000" textColor="#ffffff">
            View Details
          </PillButton>
        </div>
      </div>
    </div>
  );

  return (
    <FadeInWhenVisible
      delay={index * 0.05}
      className="border-t border-[#d0d0d0] py-8 first:border-t-0 first:pt-0 sm:py-10 lg:py-12"
    >
      {/* onMouseEnter drives the desktop hover behavior; onClick/onFocus
          cover touch and keyboard, where hover never fires — tapping a row
          makes it the active one, same as hovering does with a mouse. All
          three just call the same onActivate, so there's one source of
          truth for which row is "active" regardless of input method. */}
      <div
        role="button"
        tabIndex={0}
        onMouseEnter={onActivate}
        onClick={onActivate}
        onFocus={onActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onActivate();
        }}
        className="flex cursor-pointer flex-col gap-6 outline-none lg:flex-row lg:items-center lg:gap-10"
      >
        {imageOnRight ? (
          <>
            {content}
            {photo}
          </>
        ) : (
          <>
            {photo}
            {content}
          </>
        )}
      </div>
    </FadeInWhenVisible>
  );
}

export function PopularServicesCarousel({ services }: { services: PopularService[] }) {
  // First row active by default, matching the reference design (row 1 shows
  // the "hovered" state, the rest are muted). Mouse hover, tap, and keyboard
  // focus all move this single active index — see ServiceRow's onActivate.
  const [activeIndex, setActiveIndex] = useState(0);

  if (services.length === 0) return null;

  return (
    <section className="w-full bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center justify-center gap-2 text-center">
          <span className="font-sans text-lg font-bold text-[#2a9d8f] sm:text-xl">//</span>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[42px]">
            <span className="text-black">Our Popular</span> <span className="text-[#2a9d8f]">Services</span>
          </p>
        </FadeInWhenVisible>

        <div className="mt-8 sm:mt-10 lg:mt-12">
          {services.map((service, i) => (
            <ServiceRow
              key={service._id}
              service={service}
              index={i}
              isActive={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
              imageOnRight={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
