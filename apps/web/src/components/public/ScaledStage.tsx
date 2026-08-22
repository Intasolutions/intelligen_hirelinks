'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { usePageReady } from './PageReadyContext';

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
 *
 * The server has no viewport to measure against, so it always ships scale=1.
 * Content stays hidden (behind a skeleton) until the client's first real
 * measurement lands — otherwise there's a visible flash of full-size/broken
 * layout between hydration and the corrected scale.
 */
export function ScaledStage({ width, height, children, className = '' }: ScaledStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const stageId = useId();
  const pageReady = usePageReady();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.offsetWidth;
      setScale(Math.min(1, containerWidth / width));
      setReady(true);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // Reported from its own effect, not inline inside the layout effect above:
  // calling `pageReady.registerReady` (a setState on the ancestor
  // PageReadyProvider) synchronously from within this component's own layout
  // effect landed while React was still flushing layout effects elsewhere in
  // the tree, which triggers "Cannot update a component while rendering a
  // different component". A plain effect runs after that flush completes.
  useEffect(() => {
    if (ready) pageReady?.registerReady(stageId);
  }, [ready, pageReady, stageId]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: height * scale }}
    >
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-gray-200 to-gray-100" />
      )}
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
