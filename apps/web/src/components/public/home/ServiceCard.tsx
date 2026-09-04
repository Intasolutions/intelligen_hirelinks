'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

export interface Service {
  title: string;
  slug: string;
  description: string;
  // Rendered JSX, not a component reference — a bare React.ComponentType
  // can't cross the server→client boundary (ServicesSection renders this
  // server-side, ServiceCard is a client component), since RSC can only
  // serialize actual elements/data, not function references.
  icon: React.ReactNode;
}

// All 5 cards share one look: light by default, crossfading to the black
// background-image treatment on hover. The dark layer is a separate
// absolutely-positioned overlay that fades in via `group-hover`, so both
// the background image and the light/dark text swap animate together.
//
// Touch devices have no hover, so `pressed` mirrors the same dark state via
// tap: the first tap on a card reveals it (and is prevented from
// navigating), a second tap on an already-revealed card follows the link
// normally. Desktop pointers ignore this entirely and keep using
// group-hover — pressed only ever gets set from a 'touch' pointer type.
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [pressed, setPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === 'touch' && !pressed) {
      e.preventDefault();
      setPressed(true);
    }
  };

  return (
    <FadeInWhenVisible
      delay={0.15 + index * 0.08}
      className={`group relative flex h-full min-h-[220px] flex-col justify-center overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[260px] sm:p-8 lg:min-h-[300px] lg:p-10 ${pressed ? 'is-pressed' : ''}`}
    >
      <a href={`/services/${service.slug}`} onClick={handleClick} className="absolute inset-0 z-10" aria-label={service.title} />

      {/* Dark hover/press layer */}
      <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-100 [.is-pressed_&]:opacity-100">
        <Image
          src="/images/home/services-featured-bg.png"
          alt=""
          fill
          className="pointer-events-none select-none object-cover opacity-90"
        />
      </div>

      <div className="relative">
        <span className="pointer-events-none inline-block text-black [&_svg]:h-8 [&_svg]:w-8 group-hover:text-white [.is-pressed_&]:text-white sm:[&_svg]:h-10 sm:[&_svg]:w-10">
          {service.icon}
        </span>
        <h3
          className="pointer-events-none mt-8 whitespace-pre-line bg-gradient-to-r from-[#2a9d8f] to-[#0077b6] bg-clip-text font-display-rounded font-light leading-tight text-transparent transition-colors duration-500 group-hover:bg-none group-hover:text-white [.is-pressed_&]:bg-none [.is-pressed_&]:text-white sm:mt-12"
          style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
        >
          {service.title}
        </h3>
        <p className="pointer-events-none mt-3 max-w-md text-sm leading-relaxed text-black/70 transition-colors duration-500 group-hover:text-white/85 [.is-pressed_&]:text-white/85 lg:text-base">
          {service.description}
        </p>
      </div>
    </FadeInWhenVisible>
  );
}
