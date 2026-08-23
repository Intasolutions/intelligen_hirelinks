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
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border sm:h-10 sm:w-10 ${
        isActive ? 'border-white text-white' : 'border-black text-black'
      }`}
    >
      <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
    </span>
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
      className={`relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-6 outline-none transition-colors duration-500 ${
        isActive ? 'bg-gradient-to-b from-[#0D796C] to-[#2A9D8F] text-white' : 'bg-[#f5f5f5] text-black'
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
          className="pointer-events-none absolute inset-0 h-full w-full"
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

      <div className="relative">
        <StepIcon name={step.icon} isActive={isActive} />
        {step.description && (
          <p className={`mt-6 text-sm leading-relaxed sm:mt-8 ${isActive ? 'text-white' : 'text-black/60'}`}>
            {step.description}
          </p>
        )}
      </div>

      <div className="relative mt-6 sm:mt-8">
        <div className={`h-px w-full ${isActive ? 'bg-white/25' : 'bg-black/10'}`} />
        <p className={`mt-3 font-display-rounded text-sm font-bold sm:text-base ${isActive ? 'text-white' : 'text-black'}`}>
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
