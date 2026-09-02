import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

const INTRO =
  'Our core values guide every programme and placement we deliver. We believe in integrity, trust, transparency, excellence, compassion, and commitment, ensuring every nurse receives genuine guidance, equal opportunities, and reliable support throughout their career journey. We build lasting relationships with nurses, employers, and communities while creating meaningful opportunities for professional growth, success, and a brighter future.';

const WIDE_CARD_BODY = 'We provide honest, transparent, and reliable guidance throughout every nurse’s career and placement journey.';
const SMALL_CARD_BODY_TEAL = 'We connect nurses with domestic and international opportunities that support professional growth and a successful future.';
const SMALL_CARD_BODY_BLUE = 'We put nurses first, offering personalized guidance and continuous support to help them achieve their career goals.';

// Simple line-style icon, placeholder for the wide card until its real SVG
// is provided (same treatment the other two cards had before real assets
// landed).
function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6.5" cy="6" r="1.5" />
      <circle cx="10.5" cy="5" r="2.2" />
      <path d="M4 9.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v8c0 .83-.67 1.5-1.5 1.5h-6A1.5 1.5 0 0 1 4 17.5v-8Z" />
      <path d="m13 11.2 4.2-2.1c.53-.27 1.16.12 1.16.71v6.4c0 .59-.63.98-1.16.71L13 14.8" />
    </svg>
  );
}

interface ValueCard {
  heading: string;
  body: string;
  // Either an inline stroke-icon component (placeholders still pending real
  // assets) or a path to a real icon file exported from Figma.
  Icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  iconSrc?: string;
  variant: 'light' | 'teal' | 'blue';
}

const WIDE_CARD: ValueCard = { heading: 'Trust & Integrity', body: WIDE_CARD_BODY, Icon: CameraIcon, variant: 'light' };
const SMALL_CARDS: ValueCard[] = [
  { heading: 'Growth & Opportunity', body: SMALL_CARD_BODY_TEAL, iconSrc: '/images/about/core-value-icon-3.svg', variant: 'teal' },
  { heading: 'Nurse-Centered Support', body: SMALL_CARD_BODY_BLUE, iconSrc: '/images/about/core-value-icon-4.svg', variant: 'blue' },
];

// Card fill per variant. "light" values are exact, straight from the Figma
// panel: fill #ECECEC @ 100%, a 1px inside stroke #EDEDED, heading text
// black @ 100%, body text black @ 60%.
const CARD_STYLE: Record<ValueCard['variant'], { className: string; text: string; body: string }> = {
  light: {
    className: 'border border-[#ededed] bg-[#ececec] text-black',
    text: 'text-black',
    body: 'text-black/60',
  },
  teal: {
    className: 'bg-gradient-to-b from-[#0D796C] to-[#2A9D8F] text-white',
    text: 'text-white',
    body: 'text-white/75',
  },
  blue: {
    className: 'bg-gradient-to-b from-[#2f7ab8] to-[#0e2f4d] text-white',
    text: 'text-white',
    body: 'text-white/75',
  },
};

function Card({ card, className = '' }: { card: ValueCard; className?: string }) {
  const style = CARD_STYLE[card.variant];
  const Icon = card.Icon;
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-[8px] p-6 sm:p-8 ${style.className} ${className}`}>
      {/* Decorative squiggle, teal card only — exact path from Figma
          (463x235 viewBox), stroke white @ 6% opacity, 21px stroke. Figma's
          export used a backdrop-blur filter (foreignObject +
          feGaussianBlur/feOffset) behind the stroke; a plain CSS blur on the
          svg itself reproduces the same soft/glowing look without needing
          the filter's foreignObject/backdrop-filter machinery. */}
      {card.variant === 'teal' && (
        <svg
          aria-hidden
          viewBox="0 0 463 235"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ filter: 'blur(1.5px)' }}
          fill="none"
        >
          <path
            d="M10.5 45.7915C10.5 209.787 93.4275 52.2511 143.23 16.0518C198.061 -23.8027 206.074 164.509 144.367 155.77C111.583 151.127 161.076 72.23 204.651 63.8905C262.067 52.9019 239.078 180.714 280.015 208.785C353.569 259.219 444.658 175.713 452.5 97.7422"
            stroke="white"
            strokeOpacity="0.06"
            strokeWidth="21"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div className="relative flex items-start justify-between gap-4">
        <p className={`font-display-rounded text-xl font-bold sm:text-2xl ${style.text}`}>{card.heading}</p>
        {card.iconSrc ? (
          <div className="relative h-8 w-8 shrink-0 sm:h-10 sm:w-10">
            <Image src={card.iconSrc} alt="" fill className="object-contain" />
          </div>
        ) : Icon ? (
          <Icon className={`h-8 w-8 shrink-0 sm:h-10 sm:w-10 ${style.text}`} />
        ) : null}
      </div>

      <p className={`relative mt-10 max-w-xs font-sans text-sm leading-relaxed sm:mt-16 ${style.body}`}>{card.body}</p>
    </div>
  );
}

export function CoreValuesSection() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        {/* Helvetica Neue Regular 20px / 170% line-height / 1% letter-spacing,
            per the Figma typography panel — same body-text spec the cards
            below already use. */}
        <FadeInWhenVisible
          className="mx-auto max-w-5xl text-center font-sans italic text-black"
          style={{ fontSize: 20, lineHeight: '170%', letterSpacing: '1%' }}
        >
          {INTRO}
        </FadeInWhenVisible>

        {/* Mobile stacks all four pieces (heading block, wide card, blue
            card, teal card) in one flex column so a single `order-*` per
            item controls the whole sequence: heading -> Heading 1 ->
            Heading 2 -> Heading 3. At sm: and up this reverts to the
            original two-row grid (row 1 = wide card + heading side by side,
            row 2 = blue + teal cards), so `order` is reset via
            sm:order-none on every item and the rows regain their own
            flex-row/lg:flex-row containers. */}
        <div className="mt-10 flex flex-col gap-5 sm:mt-14 sm:block">
          <div className="contents sm:flex sm:flex-col sm:gap-6 lg:flex-row">
            <FadeInWhenVisible delay={0.1} className="order-2 flex-1 sm:order-none">
              <Card card={WIDE_CARD} className="min-h-[220px] sm:min-h-[260px]" />
            </FadeInWhenVisible>

            <FadeInWhenVisible
              delay={0.2}
              className="order-1 flex shrink-0 flex-col justify-start sm:order-none lg:w-[463px]"
            >
              {/* Helvetica Neue Bold 52px/61px line-height, per the Figma
                  typography panel — not the rounded display font used
                  elsewhere on the site. Gradient (also exact, from the
                  Figma fill panel): #202020 at 0% to pure white at 100%,
                  horizontal. "Values" (the shorter second line) doesn't
                  reach as far into the white end as "Core" does above it,
                  since the gradient is measured against the shared block
                  width, not per line. */}
              <p className="bg-gradient-to-r from-[#202020] to-white bg-clip-text font-sans text-4xl font-bold uppercase leading-[1.173] text-transparent sm:text-5xl lg:text-[52px] lg:leading-[61px]">
                Our Core Values
              </p>
              {/* 21px gap between heading and paragraph, per the Figma auto-layout panel. */}
              <p className="mt-[21px] max-w-md font-sans text-sm leading-relaxed text-[#5c5c5c] lg:text-base">
                {INTRO}
              </p>
            </FadeInWhenVisible>
          </div>

          <div className="contents sm:mt-6 sm:flex sm:gap-6">
            {SMALL_CARDS.map((card, i) => (
              <FadeInWhenVisible
                key={card.heading}
                delay={0.25 + i * 0.05}
                className={`flex-1 ${card.variant === 'blue' ? 'order-3 sm:order-none' : 'order-4 sm:order-none'}`}
              >
                <Card card={card} className="min-h-[220px] sm:min-h-[260px]" />
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
