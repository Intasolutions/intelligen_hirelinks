'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export interface MarqueeLogo {
  name: string;
  src: string;
}

interface LogoMarqueeProps {
  /**
   * Scroll speed in pixels/second — constant regardless of how many logos
   * are in the strip, so every marquee on the site visually moves at the
   * same felt pace instead of a longer strip (more logos) appearing to
   * speed up under a fixed duration. Higher = faster.
   */
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  gap?: number;
  /** Uniform rendered height for every logo (px) — width follows each logo's own aspect ratio via object-contain. */
  logoHeight?: number;
  /** Which way the strip scrolls — 'left' (default) moves right-to-left, 'right' moves left-to-right. */
  direction?: 'left' | 'right';
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
 * One-direction infinite logo strip: scrolls continuously the same way
 * (never bounces back), wrapping seamlessly. The item list is rendered
 * twice back-to-back to form one double-length track; animating `x` by
 * exactly one copy's width (half the track) and looping (not reversing)
 * means the instant the animation resets to 0, the visible content is
 * pixel-identical to the frame just before the reset — no visible seam or
 * snap. `direction="left"` (default) moves right-to-left (translates toward
 * negative x); `direction="right"` moves left-to-right (starts shifted one
 * copy-width left and animates toward 0, so the strip is always full).
 */
export function LogoMarquee({
  logos,
  children,
  speed = 40,
  gap = 64,
  className = '',
  style,
  logoHeight = 44,
  direction = 'left',
}: ImageMarqueeProps | ChildrenMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  // Missing/broken logo files show the browser's native broken-image icon by
  // default — drop a slot from the strip instead once its image fails, so a
  // not-yet-uploaded asset degrades to "fewer logos" rather than an ugly icon.
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // The track holds two back-to-back copies of the item list (see
    // `items` below), so one copy's width is exactly half the full
    // scrollWidth, including the gap that sits between the two copies.
    const measure = () => setCopyWidth(track.scrollWidth / 2);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    // Images inside the track may still be loading when this first runs;
    // re-measure once they've all settled so the copy width is accurate.
    const images = Array.from(track.querySelectorAll('img'));
    images.forEach((img) => img.addEventListener('load', measure));

    return () => {
      observer.disconnect();
      images.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [logos, children]);

  const baseItems =
    children ??
    logos
      .filter((logo) => !failedSrcs.has(logo.src))
      .map((logo) => (
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
            onError={() => setFailedSrcs((prev) => (prev.has(logo.src) ? prev : new Set(prev).add(logo.src)))}
          />
        </div>
      ));

  // Two copies back-to-back — see the loop mechanics note in the doc comment above.
  const items = [...baseItems, ...baseItems];

  // Constant px/sec speed means the animation duration must scale with how
  // wide the strip actually is (more logos = a longer copyWidth), or a
  // longer strip would visibly race across the same duration a shorter one
  // uses.
  const duration = copyWidth > 0 ? copyWidth / speed : 0;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      <motion.div
        ref={trackRef}
        className="flex w-max items-center"
        style={{ gap }}
        animate={
          copyWidth > 0
            ? direction === 'left'
              ? { x: [0, -copyWidth] }
              : { x: [-copyWidth, 0] }
            : undefined
        }
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
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
