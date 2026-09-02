import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

const LEAD_IN = 'Our mission is to connect skilled nurses with trusted career opportunities.';
const REST =
  'We simplify placement, recruitment, and career support, helping every nurse move forward with confidence, clarity, and the right opportunity.';

const WORDMARK = 'HIRELINKS';
const WORDMARK_FONT: React.CSSProperties = {
  fontFamily: 'var(--font-fh-lecturis-rounded), var(--font-helvetica-neue), sans-serif',
  fontWeight: 700,
};
// Coordinate space the glyph mask below is authored in — 600 units of font
// size on a canvas 1/0.1645 times as wide, so `fontSize={600}` here is the
// same 16.45%-of-frame size as the visible text's `text-[16.45cqw]`, and
// `y={495}` (510 − 0.025×600) puts the baseline the same 0.025em above the
// bottom edge as that text's own `bottom-0` + `leading-[0.85]` box does.
const WORDMARK_VIEWBOX = '0 0 3647 510';

/**
 * Closing "mission" band, built to the 1440x960 reference composition:
 *
 *   - a blurred stethoscope shape fills the whole band,
 *   - the paragraph sits top-left over it (black lead-in, the rest at 25% black),
 *   - the nurse cut-out stands centred on top of both, flush with the bottom,
 *   - "HIRELINKS" runs along the bottom edge as a pane of frosted glass,
 *     laid over the photo rather than clipped by it.
 *
 * Everything inside the frame is expressed as a percentage of the frame, and
 * type is sized in `cqw` (container width) rather than `vw`, so the whole
 * composition scales as one unit — including once the frame stops growing at
 * its 1600px cap.
 */
export function MissionSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Blurred decorative shape — full-bleed behind the frame. */}
      <Image
        src="/images/home/mission-decorative-shape.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-[1600px] sm:aspect-[3/2]"
        style={{ containerType: 'inline-size' }}
      >
        {/* Paragraph — bottom layer; the photo overlaps its middle. */}
        <FadeInWhenVisible className="absolute inset-x-[4.1667%] top-[6%] z-10 sm:top-[13.5%]">
          <p className="font-sans text-[7.6cqw] font-normal uppercase leading-[1.193] text-black sm:text-[5.415cqw]">
            {LEAD_IN} <span className="text-black/25">{REST}</span>
          </p>
        </FadeInWhenVisible>

        {/* "HIRELINKS" watermark, built as actual frosted glass: a backdrop
            blur clipped to the glyph shapes, not a flat tinted rectangle.

            The clip shape is a live SVG <text> in a hidden <mask> (below) —
            not a rasterised image — so it's always pixel-true to the real
            glyphs and rescales losslessly at any frame width (see the mask
            for how it stretches to fit).

            Two layers, both anchored to the bottom edge of the frame:

            1. the glass — backdrop-filter blur + saturate + a slight
               brightness lift, no contrast change (contrast<1 is what makes
               "glass" read as a milky, opaque slab instead of a transparent
               one), plus a faint flat white tint so it still holds a shape
               over the palest part of the background.
            2. the real text on top, with a thin bright stroke standing in
               for the lit edge a physical glass bevel would catch, and a
               soft cast shadow for depth. Kept at a low white fill so it
               still reads if `backdrop-filter`/`mask` aren't supported. */}
        <svg width="0" height="0" className="absolute">
          <defs>
            {/* userSpaceOnUse (the <mask> default) resolves the nested <svg>'s
                percentage width/height against the target element's own
                rendered box, so this stretches to fill it exactly the way
                `mask-size: 100% 100%` would for a bitmap mask — the standard
                way to make an SVG mask track a responsive target. */}
            <mask id="mission-wordmark-mask">
              <svg width="100%" height="100%" viewBox={WORDMARK_VIEWBOX} preserveAspectRatio="none">
                <text x="1823.5" y="495" textAnchor="middle" fill="#fff" fontSize={600} style={WORDMARK_FONT}>
                  {WORDMARK}
                </text>
              </svg>
            </mask>
          </defs>
        </svg>
{/* Layer 1: The Glass Pane (Bug Fixed) */}
<div
  aria-hidden
  className="pointer-events-none absolute inset-x-0 bottom-0 z-40 aspect-[3647/510] bg-white/[0.08]"
  style={{
    mask: 'url(#mission-wordmark-mask)',
    WebkitMask: 'url(#mission-wordmark-mask)',
    backdropFilter: 'blur(12px) saturate(1.3) brightness(1.1)',
    WebkitBackdropFilter: 'blur(12px) saturate(1.3) brightness(1.1)',
    // Forces hardware acceleration to eliminate the grid/box artifacts
    transform: 'translateZ(0)',
    willChange: 'transform',
  }}
/>

{/* Layer 2: The Crisp Edges & Lighting */}
<p
  aria-hidden
  className="pointer-events-none absolute inset-x-0 bottom-0 z-50 select-none whitespace-nowrap text-center text-[16.45cqw] uppercase leading-[0.85] text-white/5"
  style={{
    ...WORDMARK_FONT,
    // A softer, thinner stroke to mimic a glass bevel
    WebkitTextStroke: '0.006em rgba(255, 255, 255, 0.4)',
    // Ambient highlights and soft depth, replacing the harsh dark drop shadows
    textShadow:
      '0 0.02em 0.05em rgba(255, 255, 255, 0.2), 0 0.04em 0.08em rgba(0, 0, 0, 0.15)',
  }}
>
  {WORDMARK}
</p>

        {/* Nurse cut-out — centred, and bottom-anchored so the photo's edge
            and the section's edge are the same line (no gap). */}
        <div className="absolute bottom-0 left-1/2 z-30 aspect-[700/931] h-[70%] -translate-x-1/2 sm:h-[96.7%]">
          <FadeInWhenVisible delay={0.15} distance={0} className="relative h-full w-full">
            <Image
              src="/images/home/mission-nurse-photo.png"
              alt="Nurse in scrubs"
              fill
              sizes="(max-width: 640px) 70vw, 50vw"
              className="object-contain object-bottom"
            />
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
}
