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

// Vertical teal-to-blue gradient (top #2A9D8F, the sitewide brand teal ->
// bottom #0090F3), reverted from the Figma-sampled direction per feedback —
// applied to the row number in every row regardless of active state; only
// the heading text and photo mute/brighten between active and inactive.
function GradientNumber({ n }: { n: number }) {
  return (
    <p
      className="bg-gradient-to-b from-[#2A9D8F] to-[#0090F3] bg-clip-text font-display-rounded text-4xl font-bold leading-none text-transparent sm:text-5xl lg:text-6xl"
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
    <div className="relative aspect-[16/10] w-3/4 shrink-0 overflow-hidden rounded-2xl bg-[#ececec] transition-all duration-500 lg:w-1/4">
      {service.primaryImage?.url && (
        <Image
          src={service.primaryImage.url}
          alt={service.title}
          fill
          className={`object-cover transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale'}`}
          sizes="(min-width: 1024px) 25vw, 75vw"
        />
      )}
    </div>
  );

  // Only below sm (the narrow phone-stacked layout), alternate center/left
  // per row — same odd/even rhythm as imageOnRight — so the section doesn't
  // read as one long left-aligned column on small screens. sm and up reset
  // back to left-aligned; tablet/desktop are untouched by this.
  const centerOnMobile = imageOnRight;

  const content = (
    <div
      className={`flex flex-1 flex-col gap-3 py-1 sm:items-start sm:text-left lg:justify-center ${
        centerOnMobile ? 'items-center text-center' : 'items-start text-left'
      }`}
    >
      {/* Number and heading share a row instead of stacking — items-baseline
          lines up the number's baseline with the heading text's own
          baseline rather than their boxes' vertical centers, which is what
          actually reads as "same line". */}
      <div className="flex items-baseline gap-2.5 sm:gap-3">
        <GradientNumber n={index + 1} />
        {/* Active: horizontal teal-to-blue gradient (#2A9D8F -> #0077B6,
            reversed from the number's own top-to-bottom blue-to-teal
            direction per feedback) via bg-clip-text. Inactive: flat
            #C2C2C2 — bg-clip-text/text-transparent are dropped rather than
            just overridden, since a transparent text color would otherwise
            still show through the (now-irrelevant) gradient underneath. */}
        <p
          className={`font-display-rounded text-xl font-bold transition-all duration-500 sm:text-2xl lg:text-3xl ${
            isActive ? 'bg-gradient-to-r from-[#2A9D8F] to-[#0077B6] bg-clip-text text-transparent' : 'text-[#c2c2c2]'
          }`}
        >
          {service.title}
        </p>
      </div>
      <p className="max-w-md font-sans text-sm leading-relaxed text-black sm:text-base">{service.shortDescription}</p>

      {/* Only rendered (not just hidden) while active, so it never occupies
          layout space or gets tab-focused on inactive rows — kept on every
          screen size (including mobile) so tapping a row always reveals the
          same button-appear animation, not just on desktop hover. */}
      <div
        className={`grid transition-all duration-500 ease-out ${isActive ? 'mt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <PillButton href={`/services/${service.slug}`} variant="solid" bgColor="#000000" textColor="#ffffff">
            View Details
          </PillButton>
        </div>
      </div>
    </div>
  );

  return (
    <FadeInWhenVisible delay={index * 0.05} className="border-t border-[#d0d0d0] first:border-t-0">
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
        className={`mx-auto flex max-w-[1360px] cursor-pointer flex-col gap-4 px-4 py-4 outline-none transition-colors duration-300 active:bg-black/[0.03] sm:items-start sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:gap-8 lg:px-10 lg:py-5 ${
          imageOnRight ? 'items-center' : 'items-start'
        }`}
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
    <section className="w-full overflow-x-hidden bg-white py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <FadeInWhenVisible className="flex items-center justify-center gap-2 text-center">
          <span className="font-sans text-lg font-bold text-[#2a9d8f] sm:text-xl">//</span>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[42px]">
            <span className="text-black">Our Popular</span> <span className="text-[#2a9d8f]">Services</span>
          </p>
        </FadeInWhenVisible>
      </div>

      {/* Full-bleed border box for the whole list, without any vw/translate
          math: the border sits directly on THIS section-width element (no
          max-w cap here at all), so its edges are simply wherever the
          section itself naturally renders — genuinely full width with zero
          risk of overshoot/horizontal-scroll, unlike the earlier
          left-50%/-translate-x-1/2/JS-measured-width approach (which
          could mismatch the moment anything else on the page introduced
          even a sub-pixel of horizontal overflow, since it depended on
          document.documentElement.clientWidth staying in perfect sync with
          the actual rendered layout). Row content still gets its own
          max-w-[1360px] centering inside each ServiceRow. */}
      <div className="mt-8 border-x-2 border-y border-[#d0d0d0] sm:mt-10 lg:mt-12">
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
    </section>
  );
}
