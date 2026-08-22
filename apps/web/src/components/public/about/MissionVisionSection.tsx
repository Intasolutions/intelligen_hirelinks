import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

const INTRO =
  'Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.';

const BODY = INTRO;

interface Row {
  number: string;
  heading: string;
  headingColor: string;
  /** Which side the wide photo sits on — the row mirrors around this. */
  wideSide: 'left' | 'right';
  widePhoto: string;
  wideAspect: number;
  narrowPhoto: string;
  narrowAspect: number;
}

// Photo layout traced from the reference (Frame 1984078391): two rows, each
// pairing one wide 2.01:1 photo with one narrow ~0.79:1 one, mirrored (row 1
// wide-left/narrow-right, row 2 narrow-left/wide-right). Heading/body copy
// weren't in that specific crop but do belong here — confirmed separately.
const ROWS: Row[] = [
  {
    number: '01',
    heading: 'Our Mission',
    headingColor: '#111111',
    wideSide: 'left',
    widePhoto: '/images/about/mission-photo-left.png',
    wideAspect: 2312 / 1148,
    narrowPhoto: '/images/about/mission-photo-right.png',
    narrowAspect: 916 / 1148,
  },
  {
    number: '02',
    heading: 'Our Vision',
    headingColor: '#2a9d8f',
    wideSide: 'right',
    widePhoto: '/images/about/vision-photo-right.png',
    wideAspect: 2312 / 1148,
    narrowPhoto: '/images/about/vision-photo-left.png',
    narrowAspect: 900 / 1148,
  },
];

// Fluid, not stepped: sized with clamp(min, container-relative, max) against
// the row's own container width (via `cqw`, see the containerType wrapper
// below) rather than jumping between a handful of fixed breakpoint values —
// so the photo row genuinely narrows in step with the viewport at every
// width, tablet included, not just at the couple of points a sm/lg/xl jump
// would land on.
const ROW_HEIGHT = 'clamp(120px, 24cqw, 320px)';
const NUMBER_SIZE = 'clamp(40px, 8cqw, 76px)';
const HEADING_SIZE = 'clamp(24px, 5cqw, 42px)';

function RowPhoto({ src, aspect, flush }: { src: string; aspect: number; flush: 'left' | 'right' | 'none' }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[#ececec] ${
        flush === 'left' ? 'rounded-r-2xl' : flush === 'right' ? 'rounded-l-2xl' : 'rounded-2xl'
      }`}
      style={{ height: ROW_HEIGHT, aspectRatio: aspect }}
    >
      <Image src={src} alt="" fill className="object-cover" sizes="40vw" />
    </div>
  );
}

// Outline numeral — a hollow stroke with no fill, traced from the reference
// (measured stroke width ≈ 0.026em relative to the number's own height at the
// reference's scale). The reference itself sits on a black Figma canvas,
// where a *white* stroke reads clearly — but this section's real background
// is white, so the stroke is a light grey here instead; white-on-white would
// be invisible.
function OutlineNumber({ children }: { children: string }) {
  return (
    <p
      className="shrink-0 font-sans font-light leading-none text-transparent opacity-60"
      style={{ fontSize: NUMBER_SIZE, WebkitTextStroke: '1.75px #d9d9d9' } as React.CSSProperties}
    >
      {children}
    </p>
  );
}

function MissionVisionRow({ row }: { row: Row }) {
  // The wide photo always keeps a normal margin (never flush); the narrow
  // photo is always the one flush to the section's outer edge — on whichever
  // side it lands, opposite the wide one.
  const wide = <RowPhoto src={row.widePhoto} aspect={row.wideAspect} flush="none" />;
  const narrow = (
    <RowPhoto src={row.narrowPhoto} aspect={row.narrowAspect} flush={row.wideSide === 'left' ? 'right' : 'left'} />
  );
  const label = (
    <div className="flex max-w-sm shrink-0 flex-col gap-2">
      <OutlineNumber>{row.number}</OutlineNumber>
      {/* Helvetica Neue Thin, 42px at its largest, per the Figma typography
          panel — this also matches my own independent pixel measurement of
          "OUR VISION" against the precise reference (Frame 1984078391), so
          trusting it over a rough impression from a lower-res screenshot.
          Scales fluidly down from there via HEADING_SIZE on narrower rows. */}
      <p className="font-sans font-thin uppercase leading-tight" style={{ color: row.headingColor, fontSize: HEADING_SIZE }}>
        {row.heading}
      </p>
      <p className="mt-1 font-sans text-sm leading-relaxed text-[#5c5c5c] lg:text-base">{BODY}</p>
    </div>
  );

  return (
    <>
      {/* Mobile/tablet: simple vertical stack — the reference's wide-gap,
          flush-edge composition is a desktop-only arrangement that doesn't
          translate to a narrow screen. Only the wide/primary photo per row —
          one image per row (two total across the section) rather than both,
          keeping the mobile view uncluttered; the narrow supporting photo is
          desktop-only. Padded normally on both sides, since "flush on one
          side" isn't part of this fallback layout. */}
      <div className="flex flex-col items-start gap-6 px-4 sm:px-6 lg:hidden">
        <FadeInWhenVisible className="w-full">
          <div className="relative w-full overflow-hidden rounded-2xl bg-[#ececec]" style={{ aspectRatio: row.wideAspect }}>
            <Image src={row.widePhoto} alt="" fill className="object-cover" sizes="100vw" />
          </div>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.05}>{label}</FadeInWhenVisible>
      </div>

      {/* Desktop: the reference's precise layout — the narrow photo flush to
          whichever outer edge it lands on, the wide photo keeping a normal
          inset on its side, and the numeral+heading+body right after the wide
          photo with a fixed gap, then empty space out to the flush photo.
          Padding is per-row (not on a shared wrapper) since which side is
          flush flips between row 1 and row 2. */}
      <div className={`hidden items-center lg:flex ${row.wideSide === 'left' ? 'lg:pl-10' : 'lg:pr-10'}`}>
        {row.wideSide === 'left' ? (
          <>
            <FadeInWhenVisible>{wide}</FadeInWhenVisible>
            <FadeInWhenVisible delay={0.1} className="ml-10 xl:ml-14">
              {label}
            </FadeInWhenVisible>
            <div className="flex-1" />
            <FadeInWhenVisible delay={0.15}>{narrow}</FadeInWhenVisible>
          </>
        ) : (
          <>
            <FadeInWhenVisible>{narrow}</FadeInWhenVisible>
            <FadeInWhenVisible delay={0.1} className="ml-10 xl:ml-14">
              {label}
            </FadeInWhenVisible>
            <div className="flex-1" />
            <FadeInWhenVisible delay={0.15}>{wide}</FadeInWhenVisible>
          </>
        )}
      </div>
    </>
  );
}

export function MissionVisionSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10 xl:py-12">
      {/* Intro paragraph + CTA — paragraph left, button right, same row,
          top-aligned (not vertically centered) to match the reference. */}
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between sm:gap-10">
          <FadeInWhenVisible className="max-w-2xl font-sans text-sm leading-relaxed text-black lg:text-base">
            {INTRO}
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1} className="shrink-0">
            <PillButton href="#contact" bgColor="#111111" textColor="#ffffff">
              Contact Now!
            </PillButton>
          </FadeInWhenVisible>
        </div>
      </div>

      {/* Establishes the container that ROW_HEIGHT/NUMBER_SIZE/HEADING_SIZE's
          `cqw` values above are measured against — deliberately on this
          wrapper, not on any element that itself uses those units, since a
          container can't size itself with the very units it defines. */}
      <div className="mx-auto mt-12 max-w-[1600px] sm:mt-16 lg:mt-20 xl:mt-24" style={{ containerType: 'inline-size' }}>
        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-14 xl:gap-16">
          {ROWS.map((row) => (
            <MissionVisionRow key={row.number} row={row} />
          ))}
        </div>
      </div>
    </section>
  );
}
