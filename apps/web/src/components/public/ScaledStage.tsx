'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface ScaledStageProps {
  /** Native design width the children were built for (e.g. Figma's 1440px canvas). */
  width: number;
  /** Native design height. */
  height: number;
  children: ReactNode;
  className?: string;
}

/**
 * Renders fixed-size, pixel-positioned children (a Figma-native "stage") and
 * uniformly scales the whole thing down to fit the viewport width — preserving
 * every relative position/proportion exactly instead of reflowing content at
 * breakpoints. Used for the header/hero, which are built at absolute Figma
 * coordinates and must look identical at every screen size, just smaller.
 */
export function ScaledStage({ width, height, children, className = '' }: ScaledStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.offsetWidth;
      setScale(Math.min(1, containerWidth / width));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: height * scale }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
