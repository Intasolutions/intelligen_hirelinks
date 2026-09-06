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

// Light by default, crossfading to the black background-image treatment on
// hover (desktop) or when `active` is set by the parent's scroll-spy
// (mobile/tablet, where there's no hover — see ServicesGrid). The dark
// layer is a separate absolutely-positioned overlay that fades in via
// group-hover or the `is-active` class, so both the background image and
// the light/dark text swap animate together.
export function ServiceCard({
  service,
  index,
  active = false,
  cardRef,
}: {
  service: Service;
  index: number;
  /** Set by ServicesGrid's scroll-spy on mobile/tablet; ignored on desktop, which uses group-hover instead. */
  active?: boolean;
  cardRef?: (el: HTMLAnchorElement | null) => void;
}) {
  return (
    <FadeInWhenVisible
      delay={0.15 + index * 0.08}
      className={`group relative flex h-full min-h-[220px] flex-col justify-center overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[260px] sm:p-8 lg:min-h-[300px] lg:p-10 ${active ? 'is-active' : ''}`}
    >
      {/* Spans the full card and is the actual DOM node the parent's
          IntersectionObserver watches (FadeInWhenVisible is a plain
          function component with no ref forwarding, so the ref has to
          live on a real element inside it instead). */}
      <a ref={cardRef} href={`/services/${service.slug}`} className="absolute inset-0 z-10" aria-label={service.title} />

      {/* Dark hover/active layer */}
      <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-100 [.is-active_&]:opacity-100">
        <Image
          src="/images/home/services-featured-bg.png"
          alt=""
          fill
          className="pointer-events-none select-none object-cover opacity-90"
        />
      </div>

      <div className="relative">
        <span className="pointer-events-none inline-block text-black [&_svg]:h-8 [&_svg]:w-8 group-hover:text-white [.is-active_&]:text-white sm:[&_svg]:h-10 sm:[&_svg]:w-10">
          {service.icon}
        </span>
        <h3
          className="pointer-events-none mt-8 whitespace-pre-line bg-gradient-to-r from-[#2a9d8f] to-[#0077b6] bg-clip-text font-display-rounded font-light leading-tight text-transparent transition-colors duration-500 group-hover:bg-none group-hover:text-white [.is-active_&]:bg-none [.is-active_&]:text-white sm:mt-12"
          style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
        >
          {service.title}
        </h3>
        <p className="pointer-events-none mt-3 max-w-md text-sm leading-relaxed text-black/70 transition-colors duration-500 group-hover:text-white/85 [.is-active_&]:text-white/85 lg:text-base">
          {service.description}
        </p>
      </div>
    </FadeInWhenVisible>
  );
}
