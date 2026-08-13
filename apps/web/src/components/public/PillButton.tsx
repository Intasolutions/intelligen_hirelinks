'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type ElementType } from 'react';

type PillButtonVariant = 'solid' | 'white';

interface PillButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: PillButtonVariant;
  arrow?: boolean;
  external?: boolean;
}

const VARIANT_FILL: Record<PillButtonVariant, string> = {
  solid: '#2a9d8f',
  white: '#ffffff',
};

const VARIANT_TEXT: Record<PillButtonVariant, string> = {
  solid: '#ffffff',
  white: '#2a9d8f',
};

const HEIGHT = 50;
const LEFT_CAP_R = 25; // radius of the left rounded end
const PAD_LEFT = 24; // px of teal visible before the label text starts

// Right end-cap (neck + circle + arrow), traced verbatim from the Figma export
// (node 32:8759, "Frame 1984078235", original path offset by -182.5/-0.5) in
// its own local coordinate space where x=0 is the neck seam — i.e. where the
// pill's straight top/bottom wall ends and the concave curve into the circle
// begins. This chunk is fixed-shape and never stretches; only the straight
// pill run before the seam grows or shrinks with the label's measured width.
const CAP_WIDTH = 82.5;
const CAP_D = `
  M 0 0
  C 11.382 0.000001 20.985 7.60633 24.009 18.0127
  C 27.004 22.4971 30.496 22.9937 33.99 18.0117
  C 37.014 7.60569 46.619 0 58 0
  C 71.807 0 83 11.1929 83 25
  C 83 38.8071 71.807 50 58 50
  C 46.616 50 37.011 42.3914 33.989 31.9824
  C 31.985 28.4989 27.006 27.0118 24.01 31.9844
  C 20.987 42.3923 11.383 50 0 50
  Z
`.trim();

// Arrow glyph, traced verbatim from the same export into the CAP_D local space.
const ARROW_D = 'M 53 30 L 63 20 M 63 30 V 20 H 53';

function DogboneButton({
  variant,
  children,
}: {
  variant: PillButtonVariant;
  children: React.ReactNode;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelWidth, setLabelWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [children]);

  const seamX = LEFT_CAP_R + PAD_LEFT + (labelWidth ?? 0);
  const totalWidth = seamX + CAP_WIDTH;

  const bodyD = `
    M ${LEFT_CAP_R} 0
    H ${seamX}
    v ${HEIGHT}
    H ${LEFT_CAP_R}
    C 11.2 ${HEIGHT} 0 38.8 0 25
    C 0 11.2 11.2 0 ${LEFT_CAP_R} 0
    Z
  `.trim();

  return (
    <span
      className="relative inline-flex items-center"
      style={{ width: labelWidth === null ? undefined : totalWidth, height: HEIGHT }}
    >
      {labelWidth !== null && (
        <svg
          width={totalWidth}
          height={HEIGHT}
          viewBox={`0 0 ${totalWidth} ${HEIGHT}`}
          className="absolute inset-0"
          aria-hidden
        >
          <path d={bodyD} fill={VARIANT_FILL[variant]} />
          <g transform={`translate(${seamX}, 0)`}>
            <path d={CAP_D} fill={VARIANT_FILL[variant]} />
            <path
              d={ARROW_D}
              stroke={VARIANT_TEXT[variant]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </svg>
      )}
      <span
        ref={labelRef}
        className="relative whitespace-nowrap text-sm font-medium uppercase tracking-wide"
        style={{ color: VARIANT_TEXT[variant], marginLeft: PAD_LEFT }}
      >
        {children}
      </span>
    </span>
  );
}

export function PillButton({
  href,
  variant = 'solid',
  arrow = true,
  external = false,
  className = '',
  children,
  ...rest
}: PillButtonProps) {
  if (!arrow) {
    const plainClasses = [
      'inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium uppercase tracking-wide transition-colors',
      variant === 'solid' ? 'bg-[#2a9d8f] hover:bg-[#238277] text-white' : 'bg-white text-[#2a9d8f]',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={plainClasses} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={plainClasses}>
        {children}
      </Link>
    );
  }

  const Tag = (external ? 'a' : Link) as ElementType;
  const tagProps = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };

  return (
    <Tag
      {...tagProps}
      className={`inline-block transition-transform hover:scale-[1.02] ${className}`}
      {...rest}
    >
      <DogboneButton variant={variant}>{children}</DogboneButton>
    </Tag>
  );
}
