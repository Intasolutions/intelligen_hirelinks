import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { LogoMarquee, type MarqueeLogo } from '../LogoMarquee';

// Placeholder logos reusing existing brand assets until the real partner
// logos (Layers, Sisyphus, Circooles, Catalog, Quotient) are exported from
// Figma — swap src once those files land in public/images/home/. LogoMarquee
// renders every logo object-contain at the same height, so no per-logo
// width/height/display-size data is needed here.
const PARTNER_LOGOS: MarqueeLogo[] = [
  { name: 'Hirelinks', src: '/images/home/hirelinks-logo.png' },
  { name: 'Intelligen', src: '/images/home/intelligen-logo.png' },
  { name: 'GrowMedLink', src: '/images/home/growmedlink-logo.png' },
  { name: 'Hirelinks 2', src: '/images/home/hirelinks-logo.png' },
  { name: 'Intelligen 2', src: '/images/home/intelligen-logo.png' },
  { name: 'Hirelinks', src: '/images/home/hirelinks-logo.png' },
  { name: 'Intelligen', src: '/images/home/intelligen-logo.png' },
  { name: 'GrowMedLink', src: '/images/home/growmedlink-logo.png' },
  { name: 'Hirelinks 2', src: '/images/home/hirelinks-logo.png' },
  { name: 'Intelligen 2', src: '/images/home/intelligen-logo.png' },
];

// Card is 1360x369 in Figma (node 147:10516), 6px corner radius, radial
// gradient fill. The top-center notch is a separate white wedge shape
// ("Rectangle 48": 976x38, offset x=192 y=-4 relative to the card) layered
// on top of the card's straight top edge, not a clip-path on the card itself.
const CARD_WIDTH = 1360;
const CARD_HEIGHT = 369;
const NOTCH_WIDTH = 976;
const NOTCH_HEIGHT = 38;

export function PartnersSection() {
  return (
    <section className="relative w-full bg-white px-4 pb-6 pt-12 lg:px-10 lg:pb-8 lg:pt-20">
      <div
        className="relative mx-auto overflow-hidden rounded-[6px]"
        style={{
          maxWidth: CARD_WIDTH,
          aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
          background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #e2e3e5 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'url(/images/home/partners-map-bg.png)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }}
        />

        {/* Notch wedge cut into the top-center edge */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 bg-white"
          style={{
            width: `${(NOTCH_WIDTH / CARD_WIDTH) * 100}%`,
            height: `${(NOTCH_HEIGHT / CARD_HEIGHT) * 100}%`,
            clipPath: 'polygon(8% 100%, 0% 0%, 100% 0%, 92% 100%)',
          }}
        />

        <div className="relative flex h-full flex-col items-center justify-center py-10 lg:py-14">
          {/* Mobile/tablet heading, matching StatsSection's mobile size exactly */}
          <FadeInWhenVisible className="flex items-center justify-center gap-2 px-6 pt-6 text-center lg:hidden">
            <div className="relative h-[22px] w-[25px] shrink-0">
              <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
            </div>
            <p className="font-display-rounded text-2xl font-bold text-black sm:text-3xl">
              <span className="text-black">Our</span>{' '}
              <span className="text-[#2a9d8f]">International Partners</span>
            </p>
          </FadeInWhenVisible>

          {/* Desktop heading, matching StatsSection's desktop size exactly (42px) */}
          <FadeInWhenVisible className="hidden items-center justify-center gap-2 pt-10 text-center lg:flex">
            <div className="relative h-[30px] w-[34px] shrink-0">
              <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
            </div>
            <p className="whitespace-nowrap font-display-rounded font-bold text-black" style={{ fontSize: 42 }}>
              <span className="text-black">Our</span>{' '}
              <span className="text-[#2a9d8f]">International Partners</span>
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.15} className="relative mt-6 w-full lg:mt-14">
            <LogoMarquee
              logos={PARTNER_LOGOS}
              duration={6}
              logoHeight={60}
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              }}
            />
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
}
