'use client';

import { useEffect, useRef, useState } from 'react';
import { ServiceCard, type Service } from './ServiceCard';

// Mirrors PopularServicesCarousel's mobile scroll-spy: below lg (no hover),
// whichever card crosses the vertical center of the viewport highlights
// automatically as the list scrolls. Desktop keeps ServiceCard's own
// group-hover — this only drives the `active` prop used on touch.
export function ServicesGrid({ services }: { services: Service[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
  }, [services.length]);

  return (
    <div className="mt-10 w-full bg-white lg:mt-14">
      {/* Row 1: three equal columns */}
      <div className="grid grid-cols-1 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {services.slice(0, 3).map((service, i) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={i}
            active={activeIndex === i}
            cardRef={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}
      </div>
      {/* Row 2: 1/3 + 2/3 split */}
      {services.length > 3 && (
        <div className="grid grid-cols-1 divide-y divide-[#e5e5e5] border-b border-[#e5e5e5] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <div>
            <ServiceCard
              service={services[3]}
              index={3}
              active={activeIndex === 3}
              cardRef={(el) => {
                cardRefs.current[3] = el;
              }}
            />
          </div>
          {services[4] && (
            <div className="lg:col-span-2">
              <ServiceCard
                service={services[4]}
                index={4}
                active={activeIndex === 4}
                cardRef={(el) => {
                  cardRefs.current[4] = el;
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
