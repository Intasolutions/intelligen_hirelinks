'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type ElementType } from 'react';

type PillButtonVariant = 'solid' | 'white';

interface PillButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Convenience presets for the common teal/white combos used across the site. */
  variant?: PillButtonVariant;
  /** Override the shape fill. Takes precedence over `variant`. */
  bgColor?: string;
  /** Override the label + arrow color. Takes precedence over `variant`. */
  textColor?: string;
  /** Border stroke color; omit for no border. */
  borderColor?: string;
  arrow?: boolean;
  external?: boolean;
  /** False renders the same shape with no Link/anchor wrapper — for a
   * decorative/disabled-looking pill that must not itself be a nested
   * interactive element (e.g. inside a parent that's already a button). */
  interactive?: boolean;
  /** Renders just the trailing arrow circle, no pill body/label — for tight
   * spaces (e.g. mobile cards) where the full pill would overwhelm the
   * layout. Same arrow glyph/hover-rotate as the full button. */
  iconOnly?: boolean;
}

const VARIANT_FILL: Record<PillButtonVariant, string> = {
  solid: '#2a9d8f',
  white: '#ffffff',
};

const VARIANT_TEXT: Record<PillButtonVariant, string> = {
  solid: '#ffffff',
  white: '#2a9d8f',
};

const HEIGHT = 42;
const SCALE = HEIGHT / 50; // source geometry was traced at 50px tall
const LEFT_CAP_R = 25 * SCALE;
const PAD_LEFT = 22 * SCALE;
const BORDER_WIDTH = 1;
const CAP_WIDTH = 82.5 * SCALE;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Right end-cap (neck + circle), traced verbatim from the Figma export (node
// 32:8759, "Frame 1984078235", original path offset by -182.5/-0.5), given
// here as raw (x,y) point pairs at 1x scale so it can be emitted inline as
// part of ONE continuous path with the pill body — a single path means a
// single fill/stroke, so no seam line can appear at the body/cap join.
const CAP_POINTS_1X: [number, number][] = [
  [11.382, 0], [20.985, 7.60633], [24.009, 18.0127],
  [27.004, 22.4971], [30.496, 22.9937], [33.99, 18.0117],
  [37.014, 7.60569], [46.619, 0], [58, 0],
  [71.807, 0], [83, 11.1929], [83, 25],
  [83, 38.8071], [71.807, 50], [58, 50],
  [46.616, 50], [37.011, 42.3914], [33.989, 31.9824],
  [31.985, 28.4989], [27.006, 27.0118], [24.01, 31.9844],
  [20.987, 42.3923], [11.383, 50], [0, 50],
];

// Arrow glyph center, in the cap's local space, used to rotate ↗ into → on hover.
const ARROW_CENTER_X_1X = 58;
const ARROW_CENTER_Y_1X = 25;
const ARROW_SIZE_1X = 5;
const ARROW_D_1X = `M ${ARROW_CENTER_X_1X - ARROW_SIZE_1X} ${ARROW_CENTER_Y_1X + ARROW_SIZE_1X} L ${ARROW_CENTER_X_1X + ARROW_SIZE_1X} ${ARROW_CENTER_Y_1X - ARROW_SIZE_1X} M ${ARROW_CENTER_X_1X + ARROW_SIZE_1X} ${ARROW_CENTER_Y_1X + ARROW_SIZE_1X} V ${ARROW_CENTER_Y_1X - ARROW_SIZE_1X} H ${ARROW_CENTER_X_1X - ARROW_SIZE_1X}`;

function DogboneButton({
  fill,
  textColor,
  border,
  children,
}: {
  fill: string;
  textColor: string;
  border?: string;
  children: React.ReactNode;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelText = typeof children === 'string' ? children : '';
  // Rough character-width estimate sizes the SVG shape correctly for
  // server-rendered/first-paint HTML; useLayoutEffect corrects it to the exact
  // measured width immediately after mount, before the browser paints.
  const estimatedWidth = Math.round(labelText.length * 7.2 * SCALE);
  const [labelWidth, setLabelWidth] = useState<number>(estimatedWidth);

  useLayoutEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, [children]);

  const seamX = round2(LEFT_CAP_R + PAD_LEFT + labelWidth);
  const shapeWidth = round2(seamX + CAP_WIDTH);
  const r = round2(HEIGHT / 2);

  // A centered stroke extends half its width outside the path's own geometry.
  // If the shape touches the SVG viewport's edges exactly, that outer half gets
  // clipped — most visibly on the right, where the trailing circle sits flush
  // against the viewBox boundary. Inset the whole drawing by `pad` and grow the
  // SVG element to match so the border has room to render on every side.
  const pad = border ? BORDER_WIDTH : 0;
  const totalWidth = round2(shapeWidth + pad * 2);
  const totalHeight = round2(HEIGHT + pad * 2);

  // Round every coordinate to 2dp — raw floating-point products (e.g. from
  // `* SCALE`) can carry long repeating decimals, and SVG renderers alias
  // stroke edges unevenly on those, showing up as small gaps/missing pixels
  // along the border at the curve joints.
  const capPoints = CAP_POINTS_1X.map(([x, y]) => [round2(seamX + x * SCALE), round2(y * SCALE)]);
  const capCurve = [0, 3, 6, 9, 12, 15, 18, 21]
    .map(
      (i) =>
        `C ${capPoints[i][0]} ${capPoints[i][1]} ${capPoints[i + 1][0]} ${capPoints[i + 1][1]} ${capPoints[i + 2][0]} ${capPoints[i + 2][1]}`
    )
    .join(' ');

  // One continuous outline: left round cap -> straight top -> neck+circle (cap
  // curve) -> straight bottom -> back to start. Single path = single fill/stroke,
  // so there is no seam between the pill body and the trailing circle.
  const outlineD = `
    M ${LEFT_CAP_R} 0
    H ${seamX}
    ${capCurve}
    H ${LEFT_CAP_R}
    C ${round2(r * 0.448)} ${HEIGHT} 0 ${round2(HEIGHT * 0.776)} 0 ${r}
    C 0 ${round2(r * 0.448)} ${round2(r * 0.448)} 0 ${LEFT_CAP_R} 0
    Z
  `.trim();

  const arrowD = `M ${round2(seamX + (ARROW_CENTER_X_1X - ARROW_SIZE_1X) * SCALE)} ${round2((ARROW_CENTER_Y_1X + ARROW_SIZE_1X) * SCALE)} L ${round2(seamX + (ARROW_CENTER_X_1X + ARROW_SIZE_1X) * SCALE)} ${round2((ARROW_CENTER_Y_1X - ARROW_SIZE_1X) * SCALE)} M ${round2(seamX + (ARROW_CENTER_X_1X + ARROW_SIZE_1X) * SCALE)} ${round2((ARROW_CENTER_Y_1X + ARROW_SIZE_1X) * SCALE)} V ${round2((ARROW_CENTER_Y_1X - ARROW_SIZE_1X) * SCALE)} H ${round2(seamX + (ARROW_CENTER_X_1X - ARROW_SIZE_1X) * SCALE)}`;

  return (
    <span
      className="pill-button relative inline-flex items-center justify-center"
      style={{ width: totalWidth, height: totalHeight }}
    >
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`${-pad} ${-pad} ${totalWidth} ${totalHeight}`}
        className="absolute inset-0"
        aria-hidden
      >
        <path
          d={outlineD}
          fill={fill}
          stroke={border}
          strokeWidth={pad ? BORDER_WIDTH : 0}
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
        />
        <g
          className="pill-button-arrow"
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        >
          <path
            d={arrowD}
            stroke={textColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap text-center font-sans font-medium uppercase"
        style={{
          color: textColor,
          width: seamX,
          height: HEIGHT,
          left: pad,
          top: pad,
          fontSize: 16,
          lineHeight: '169%',
          letterSpacing: '1%',
        }}
      >
        <span ref={labelRef}>{children}</span>
      </span>
      <style jsx>{`
        .pill-button-arrow {
          transition: transform 0.25s ease;
        }
        .pill-button:hover .pill-button-arrow {
          transform: rotate(45deg);
        }
      `}</style>
    </span>
  );
}

const ICON_SIZE = 36;

// Just the trailing circle + arrow from DogboneButton's shape, at a smaller
// fixed size — same glyph, same hover-rotate, no pill body/label to measure.
function IconButton({ fill, textColor, border }: { fill: string; textColor: string; border?: string }) {
  const r = ICON_SIZE / 2;
  const pad = border ? BORDER_WIDTH : 0;
  const total = round2(ICON_SIZE + pad * 2);
  const size = 4.5;
  const arrowD = `M ${r - size} ${r + size} L ${r + size} ${r - size} M ${r + size} ${r + size} V ${r - size} H ${r - size}`;

  return (
    <span className="pill-button relative inline-flex items-center justify-center" style={{ width: total, height: total }}>
      <svg width={total} height={total} viewBox={`${-pad} ${-pad} ${total} ${total}`} className="absolute inset-0" aria-hidden>
        <circle cx={r} cy={r} r={r} fill={fill} stroke={border} strokeWidth={pad ? BORDER_WIDTH : 0} />
        <g className="pill-button-arrow" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
          <path d={arrowD} stroke={textColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
      <style jsx>{`
        .pill-button-arrow {
          transition: transform 0.25s ease;
        }
        .pill-button:hover .pill-button-arrow {
          transform: rotate(45deg);
        }
      `}</style>
    </span>
  );
}

export function PillButton({
  href,
  variant = 'solid',
  bgColor,
  textColor,
  borderColor,
  arrow = true,
  external = false,
  interactive = true,
  iconOnly = false,
  className = '',
  children,
  ...rest
}: PillButtonProps) {
  const fill = bgColor ?? VARIANT_FILL[variant];
  const text = textColor ?? VARIANT_TEXT[variant];
  const shape = iconOnly ? (
    <IconButton fill={fill} textColor={text} border={borderColor} />
  ) : (
    <DogboneButton fill={fill} textColor={text} border={borderColor}>
      {children}
    </DogboneButton>
  );

  if (!interactive) {
    return <span className={`inline-block ${className}`}>{shape}</span>;
  }

  if (!arrow) {
    const plainClasses = 'inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wide transition-colors';
    const plainStyle = {
      backgroundColor: fill,
      color: text,
      border: borderColor ? `${BORDER_WIDTH}px solid ${borderColor}` : undefined,
    };

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${plainClasses} ${className}`}
          style={plainStyle}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={`${plainClasses} ${className}`} style={plainStyle}>
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
      {shape}
    </Tag>
  );
}
