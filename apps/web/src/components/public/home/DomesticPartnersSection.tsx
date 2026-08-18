import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { LogoMarquee, type MarqueeLogo } from '../LogoMarquee';

// Real hospital-brand logos — drop the exported files into public/images/home/
// with these exact names, or update the src paths below to match whatever
// filenames you use.
const DOMESTIC_PARTNER_LOGOS: MarqueeLogo[] = [
  { name: 'BMH', src: '/images/home/domestic-partner-bmh.png' },
  { name: 'Aster', src: '/images/home/domestic-partner-aster.png' },
  { name: 'VPS Lakeshore', src: '/images/home/domestic-partner-lakeshore.png' },
  { name: 'KIMS Hospitals', src: '/images/home/domestic-partner-kims.png' },
  { name: 'Apollo Hospitals', src: '/images/home/domestic-partner-apollo.png' },
];

export function DomesticPartnersSection() {
  return (
    <section className="relative w-full bg-white px-4 pb-16 pt-8 lg:px-10 lg:pb-24 lg:pt-14">
      <div className="mx-auto max-w-[1360px]">
        {/* Mobile/tablet heading — left-aligned, matching the reference layout */}
        <FadeInWhenVisible className="flex items-start gap-2 lg:hidden">
          <div className="relative mt-1 h-[18px] w-[20px] shrink-0">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl">
            <span className="text-black">Our</span>{' '}
            <span className="text-[#2a9d8f]">Domestic Partners</span>
          </p>
        </FadeInWhenVisible>

        {/* Desktop heading — left-aligned, same left edge as PartnersSection's card above */}
        <FadeInWhenVisible className="hidden items-center gap-2 lg:flex">
          <div className="relative h-[30px] w-[34px] shrink-0">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="whitespace-nowrap font-display-rounded font-bold text-black" style={{ fontSize: 42 }}>
            <span className="text-black">Our</span>{' '}
            <span className="text-[#2a9d8f]">Domestic Partners</span>
          </p>
        </FadeInWhenVisible>

        <div className="mt-8 h-px w-full bg-[#e5e5e5] lg:mt-10" />

        {/* Mobile/tablet carousel — same sizing knobs as PartnersSection's mobile carousel. */}
        <FadeInWhenVisible delay={0.15} className="relative mt-10 w-full lg:hidden">
          <LogoMarquee
            logos={DOMESTIC_PARTNER_LOGOS}
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

        {/* Desktop carousel — same sizing/speed as PartnersSection's desktop carousel. */}
        <FadeInWhenVisible delay={0.15} className="relative mt-14 hidden w-full lg:block">
          <LogoMarquee
            logos={DOMESTIC_PARTNER_LOGOS}
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
    </section>
  );
}
