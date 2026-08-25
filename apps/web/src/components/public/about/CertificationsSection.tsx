import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { LogoMarquee, type MarqueeLogo } from '../LogoMarquee';
import { PartnerLogosService } from '../../../services/partner-logos.service';

async function getCertificationLogos(): Promise<MarqueeLogo[]> {
  try {
    const res = await PartnerLogosService.getPublicPartnerLogos('CERTIFICATION');
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

// Exact copy of PartnersSection (homepage) — same card/notch/marquee, only
// the heading text and logo set differ.
export async function CertificationsSection() {
  const certificationLogos = await getCertificationLogos();
  if (certificationLogos.length === 0) return null;

  return (
    <section className="relative w-full bg-white px-4 pb-6 pt-4 lg:px-10 lg:pb-8 lg:pt-8">
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
          {/* Mobile/tablet heading. Unlike PartnersSection's original text
              ("Our International Partners"), "Certifications & Affiliations"
              is long enough that the fixed text-2xl/sm:text-3xl sizing wraps
              it to two lines on narrow screens — fluid `clamp()` sizing (off
              the viewport, not a container query — this component has no
              container context set up) keeps it on one line at any width
              instead, matching the desktop version's own whitespace-nowrap.
              No px-4 here — the outer section already insets the whole card,
              so a second px-4 here was only eating into the width available
              for the text on top of that. */}
          <FadeInWhenVisible className="flex items-center justify-center gap-2 pt-3 text-center lg:hidden">
            <div className="relative h-[4.2vw] w-[4.6vw] max-h-[18px] max-w-[20px] min-h-[12px] min-w-[13px] shrink-0">
              <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
            </div>
            <p
              className="whitespace-nowrap font-display-rounded font-bold leading-tight text-black"
              style={{ fontSize: 'clamp(13px, 4.8vw, 30px)' }}
            >
              <span className="text-black">Certifications &amp;</span>{' '}
              <span className="text-[#2a9d8f]">Affiliations</span>
            </p>
          </FadeInWhenVisible>

          {/* Desktop heading, matching StatsSection's desktop size exactly (42px) */}
          <FadeInWhenVisible className="hidden items-center justify-center gap-2 pt-10 text-center lg:flex">
            <div className="relative h-[30px] w-[34px] shrink-0">
              <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
            </div>
            <p className="whitespace-nowrap font-display-rounded font-bold text-black" style={{ fontSize: 42 }}>
              <span className="text-black">Certifications &amp;</span>{' '}
              <span className="text-[#2a9d8f]">Affiliations</span>
            </p>
          </FadeInWhenVisible>

          {/* Mobile/tablet carousel — smaller + slower + tighter gap than desktop.
              ADJUST MOBILE LOGO SIZE: logoHeight below.
              ADJUST MOBILE CAROUSEL SPEED: duration below (seconds per sweep —
              higher = slower).
              ADJUST MOBILE GAP BETWEEN LOGOS: gap below (pixels). */}
          <FadeInWhenVisible delay={0.15} className="relative mt-6 w-full lg:hidden">
            <LogoMarquee
              logos={certificationLogos}
              duration={14}
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
              logos={certificationLogos}
              duration={6}
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
