'use client';

import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { FadeInWhenVisible } from '../../FadeInWhenVisible';

export interface ServiceStep {
  title: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

function StepIcon({ name, isActive }: { name?: string; isActive: boolean }) {
  const Icon = (name && (LucideIcons as any)[name]) || LucideIcons.Compass;
  return (
    <Icon
      className={`h-7 w-7 transition-transform duration-500 ease-out group-hover:scale-110 sm:h-8 sm:w-8 ${isActive ? 'text-white' : 'text-black'}`}
      strokeWidth={1.75}
    />
  );
}

function StepCard({ step, isActive, onActivate }: { step: ServiceStep; isActive: boolean; onActivate: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={onActivate}
      onClick={onActivate}
      onFocus={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onActivate();
      }}
      className={`group relative flex h-full min-h-[300px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-6 outline-none transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl sm:min-h-[340px] ${
        isActive ? 'bg-gradient-to-b from-[#2A9D8F] to-[#0D796C] text-white' : 'bg-[#f5f5f5] text-black'
      }`}
    >
      {/* Same decorative squiggle CoreValuesSection uses on its teal card,
          traced from Figma — only shown on the active card, matching that
          component's own active/teal-only treatment. */}
      {isActive && (
        <svg
          aria-hidden
          viewBox="0 0 463 235"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500"
          style={{ filter: 'blur(1.5px)' }}
          fill="none"
        >
          <path
            d="M10.5 45.7915C10.5 209.787 93.4275 52.2511 143.23 16.0518C198.061 -23.8027 206.074 164.509 144.367 155.77C111.583 151.127 161.076 72.23 204.651 63.8905C262.067 52.9019 239.078 180.714 280.015 208.785C353.569 259.219 444.658 175.713 452.5 97.7422"
            stroke="white"
            strokeOpacity="0.06"
            strokeWidth="21"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Icon pinned to the top of the card; everything else (description,
          divider, title) anchors to the bottom via the card's own
          justify-end, so short descriptions don't leave the icon stranded
          far above a big empty gap — the content block just sits low and
          grows upward as needed. */}
      <StepIcon name={step.icon} isActive={isActive} />

      <div className="relative mt-auto">
        {step.description && (
          <p className={`text-sm leading-relaxed transition-colors duration-500 ${isActive ? 'text-white' : 'text-black/60'}`}>
            {step.description}
          </p>
        )}
        <div className={`mt-6 h-px w-full transition-colors duration-500 sm:mt-8 ${isActive ? 'bg-white/25' : 'bg-black/10'}`} />
        <p
          className={`mt-3 font-display-rounded text-sm font-bold transition-colors duration-500 sm:text-base ${
            isActive ? 'text-white' : 'text-black'
          }`}
        >
          {step.title}
        </p>
      </div>
    </div>
  );
}

export function ServiceProcessSection({ description, steps }: { description?: string; steps: ServiceStep[] }) {
  // Second step highlighted by default, matching the reference — hover/tap
  // moves it from there, same interaction pattern as PopularServicesCarousel.
  const [activeIndex, setActiveIndex] = useState(1);

  if (steps.length === 0 && !description) return null;

  const sorted = [...steps].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="w-full bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center justify-center gap-2 text-center">
          <span className="font-sans text-lg font-bold text-[#2a9d8f] sm:text-xl">//</span>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[42px]">
            <span className="text-black">Our</span> <span className="text-[#2a9d8f]">Processes</span>
          </p>
        </FadeInWhenVisible>

        {description && (
          <FadeInWhenVisible
            delay={0.05}
            className="mx-auto mt-4 max-w-4xl text-center font-sans text-sm leading-relaxed text-black sm:mt-6 sm:text-base lg:text-lg"
          >
            {description}
          </FadeInWhenVisible>
        )}

        {sorted.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {sorted.map((step, i) => (
              <FadeInWhenVisible key={`${step.title}-${i}`} delay={0.1 + i * 0.05}>
                <StepCard step={step} isActive={activeIndex === i} onActivate={() => setActiveIndex(i)} />
              </FadeInWhenVisible>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
