'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface FadeInWhenVisibleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Stagger delay in seconds — pass an increasing value for siblings entering in sequence. */
  delay?: number;
  /** Pixels to slide up from on entry. */
  distance?: number;
}

/**
 * Fades + slides an element up once when it first scrolls into view. Uses
 * `viewport={{ once: true }}` so it never re-triggers on scroll-back, and a
 * small negative margin so it starts a little before fully entering the
 * viewport rather than right at the edge.
 */
export function FadeInWhenVisible({
  children,
  className,
  style,
  delay = 0,
  distance = 24,
}: FadeInWhenVisibleProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
