import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

const PARAGRAPH_1 =
  'Choose Intelligen Hirelinks for a complete and coordinated nursing career journey. We bring career guidance, recruitment, placement, licensing, documentation, visa, immigration, PR, and relocation support together in one platform. With personalized guidance and dedicated support, we help nurses confidently move from career planning to successful employment - both domestically and internationally.';

const PARAGRAPH_2 =
  'At Intelligen Hirelinks, we are committed to making every nurse’s career journey simple, transparent, and successful. From the first step of career planning to recruitment and final placement, our team provides personalized support for domestic and international opportunities.';

// Same K-shaped mask used in StatsSection, reused here as a faint bottom-right
// brand watermark on the solid blue field.
const K_MASK_STYLE = {
  maskImage: 'url(/images/home/stats-k-mask.png)',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskImage: 'url(/images/home/stats-k-mask.png)',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  WebkitMaskSize: 'contain',
} as const;

export function WhyChooseUsSection() {
  return (
    // The source photo already blends from a clear left edge into solid blue
    // on the right (it's baked into the image itself) — so it renders
    // full-bleed with no extra CSS gradient/crop layered on top.
    <section className="relative w-full overflow-hidden bg-[#0077b6]">
      <div className="absolute inset-0">
        <Image src="/images/home/why-choose-us-bg.png" alt="" fill className="object-cover" priority={false} />
      </div>

      {/* Faint K-shaped brand watermark, bottom-right. */}
      <div
        className="pointer-events-none absolute bottom-6 right-6 h-[140px] w-[140px] bg-white/15 sm:h-[180px] sm:w-[180px] lg:bottom-10 lg:right-10 lg:h-[220px] lg:w-[220px]"
        style={K_MASK_STYLE}
      />

      <div className="relative mx-auto flex max-w-[1440px] items-start px-4 py-10 sm:py-16 lg:min-h-[560px] lg:items-start lg:px-[60px] lg:py-20">
        <div className="w-full max-w-2xl text-justify lg:ml-[40%] lg:max-w-[720px]">
          <FadeInWhenVisible>
            <h2 className="text-left font-display-rounded text-4xl font-light leading-tight text-white sm:text-5xl lg:text-[64px]">
              Why Nurses Choose Us
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1} className="mt-6 font-sans text-base leading-relaxed text-white lg:mt-10 lg:text-lg">
            {PARAGRAPH_1}
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.15} className="mt-6 font-sans text-base leading-relaxed text-white lg:mt-8 lg:text-lg">
            {PARAGRAPH_2}
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
}
