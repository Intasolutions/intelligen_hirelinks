import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { LogoMarquee, type MarqueeLogo } from '../LogoMarquee';
import { PartnerLogosService } from '../../../services/partner-logos.service';

async function getDomesticPartnerLogos(): Promise<MarqueeLogo[]> {
  try {
    const res = await PartnerLogosService.getPublicPartnerLogos('DOMESTIC');
    const logos = (res.data ?? []) as any[];
    return logos.filter((l) => l.logo?.url).map((l) => ({ name: l.name, src: l.logo.url }));
  } catch {
    return [];
  }
}

export async function DomesticPartnersSection() {
  const domesticPartnerLogos = await getDomesticPartnerLogos();
  if (domesticPartnerLogos.length === 0) return null;

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
            logos={domesticPartnerLogos}
            direction="left"
            speed={30}
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
            logos={domesticPartnerLogos}
            direction="left"
            speed={40}
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
