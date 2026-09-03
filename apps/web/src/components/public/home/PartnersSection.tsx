import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { LogoMarquee, type MarqueeLogo } from '../LogoMarquee';
import { PartnerLogosService } from '../../../services/partner-logos.service';

async function getInternationalPartnerLogos(): Promise<MarqueeLogo[]> {
  try {
    const res = await PartnerLogosService.getPublicPartnerLogos('INTERNATIONAL');
    const logos = (res.data ?? []) as any[];
    return logos.filter((l) => l.logo?.url).map((l) => ({ name: l.name, src: l.logo.url }));
  } catch {
    return [];
  }
}

// Card is 1360x369 in Figma (node 147:10516), 6px corner radius, radial
// gradient fill. The top-center notch is a separate white wedge shape
// ("Rectangle 48": 976x38, offset x=192 y=-4 relative to the card) layered
// on top of the card's straight top edge, not a clip-path on the card itself.
const CARD_WIDTH = 1360;
const CARD_HEIGHT = 369;
const NOTCH_WIDTH = 976;
const NOTCH_HEIGHT = 38;

export async function PartnersSection() {
  const partnerLogos = await getInternationalPartnerLogos();
  if (partnerLogos.length === 0) return null;

  return (
    <section className="relative w-full bg-white px-4 pb-6 pt-4 lg:px-10 lg:pb-8 lg:pt-20">
      <div
        className="relative mx-auto overflow-hidden rounded-[6px] lg:aspect-[1360/369]"
        style={{
          maxWidth: CARD_WIDTH,
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
          {/* Mobile/tablet heading, matching StatsSection's mobile size exactly
              (text-2xl/sm:text-3xl). ADJUST HEADING SIZE HERE if needed. */}
          <FadeInWhenVisible className="flex items-start justify-center gap-2 px-4 pt-3 text-center lg:hidden">
            <div className="relative mt-1 h-[18px] w-[20px] shrink-0">
              <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
            </div>
            <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl">
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

          {/* Mobile/tablet carousel — smaller + slower + tighter gap than desktop.
              ADJUST MOBILE LOGO SIZE: logoHeight below.
              ADJUST MOBILE CAROUSEL SPEED: speed below (px/sec —
              higher = faster).
              ADJUST MOBILE GAP BETWEEN LOGOS: gap below (pixels). */}
          <FadeInWhenVisible delay={0.15} className="relative mt-6 w-full lg:hidden">
            <LogoMarquee
              logos={partnerLogos}
              direction="right"
              speed={40}
              logoHeight={40}
              gap={25}
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              }}
            />
          </FadeInWhenVisible>

          {/* Desktop carousel. ADJUST DESKTOP GAP BETWEEN LOGOS: gap below (pixels). */}
          <FadeInWhenVisible delay={0.15} className="relative mt-14 hidden w-full lg:block">
            <LogoMarquee
              logos={partnerLogos}
              direction="right"
              speed={55}
              logoHeight={60}
              gap={64}
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
