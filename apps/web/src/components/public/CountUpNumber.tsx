'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface CountUpNumberProps {
  /** Final numeric value to count up to. */
  value: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animates a number counting up from 0 to `value` once it scrolls into view.
 * Renders a plain span (no motion wrapper needed) — the count itself is the
 * animation, driven by requestAnimationFrame with an ease-out curve.
 */
export function CountUpNumber({ value, duration = 1.4, className, style }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayValue}
    </span>
  );
}
