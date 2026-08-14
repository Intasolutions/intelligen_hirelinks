'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export interface MarqueeLogo {
  name: string;
  src: string;
}

interface LogoMarqueeProps {
  /** Seconds for one full traversal (end to end) — lower is faster. */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  gap?: number;
  /** Uniform rendered height for every logo (px) — width follows each logo's own aspect ratio via object-contain. */
  logoHeight?: number;
}

interface ImageMarqueeProps extends LogoMarqueeProps {
  logos: MarqueeLogo[];
  children?: never;
}

interface ChildrenMarqueeProps extends LogoMarqueeProps {
  logos?: never;
  /** Render arbitrary content per repeat instead of a fixed image list. */
  children: ReactNode[];
}

/**
 * Ping-pong logo strip: scrolls smoothly to one end, reverses, scrolls back,
 * repeats forever (motion's `animate` with `repeatType: 'reverse'`). The item
 * list is repeated several times so the track is always much wider than the
 * visible frame — the row stays visually full at both animation extremes,
 * never revealing empty space mid-bounce. Bounce distance is measured against
 * the actual container width (not the browser viewport), re-measured after
 * images finish loading in case that shifts the track's natural width.
 */
export function LogoMarquee({
  logos,
  children,
  duration = 10,
  gap = 64,
  className = '',
  style,
  logoHeight = 44,
}: ImageMarqueeProps | ChildrenMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [bounceDistance, setBounceDistance] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const measure = () => {
      const distance = track.scrollWidth - container.offsetWidth;
      setBounceDistance(distance > 0 ? distance : 0);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(track);

    // Images inside the track may still be loading when this first runs;
    // re-measure once they've all settled so the bounce distance is accurate.
    const images = Array.from(track.querySelectorAll('img'));
    images.forEach((img) => img.addEventListener('load', measure));

    return () => {
      observer.disconnect();
      images.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [logos, children]);

  const baseItems =
    children ??
    logos.map((logo) => (
      <div
        key={logo.name}
        className="relative flex shrink-0 items-center justify-center"
        style={{ height: logoHeight, width: logoHeight * 2.5 }}
      >
        <Image
          src={logo.src}
          alt={logo.name}
          fill
          className="object-contain"
        />
      </div>
    ));

  const items = baseItems;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      <motion.div
        ref={trackRef}
        className="flex w-max items-center"
        style={{ gap }}
        animate={bounceDistance > 0 ? { x: [0, -bounceDistance] } : undefined}
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
