import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

const INTRO = 'Intelligen Hirelinks is a dedicated nursing career, recruitment, and placement platform built to connect nurses with the right opportunities in India and around the world.';

// Small B&W strip images below the heading — drop the exported files into
// public/images/home/ with these exact names, or update the paths to match.
const STRIP_IMAGES = [
  { src: '/images/home/about-strip-1.png', alt: '' },
  { src: '/images/home/about-strip-2.png', alt: '' },
  { src: '/images/home/about-strip-3.png', alt: '' },
];

export function AboutUsSection() {
  return (
    <section className="relative w-full bg-white px-4 py-16 lg:px-[60px] lg:py-24">
      <div className="mx-auto max-w-[1320px] lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-12">
        {/* Left column — heading, copy, strip images, CTA */}
        <div className="flex flex-col">
          <FadeInWhenVisible className="flex items-start gap-2">
            <div className="relative mt-1.5 h-[18px] w-[20px] shrink-0 lg:mt-2.5 lg:h-[30px] lg:w-[34px]">
              <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
            </div>
            <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[42px]">
              <span className="text-black">About</span> <span className="text-[#2a9d8f]">Us</span>
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1} className="mt-6 max-w-lg font-sans text-sm leading-relaxed text-black lg:mt-8 lg:text-lg">
            {INTRO}
          </FadeInWhenVisible>

          <FadeInWhenVisible
            delay={0.15}
            className="mt-8 max-w-xl font-sans text-xl leading-snug lg:mt-10 lg:text-[32px]"
          >
            <span className="font-medium text-black">We provide end-to-end support throughout the nursing career journey. </span>
            <span className="font-normal text-[#b9b9b9]">
              From career counselling and profile assessment to documentation, credential evaluation, licensing, exam preparation, interviews, recruitment, placement, visa, immigration, PR pathways, and relocation support.
            </span>
          </FadeInWhenVisible>

          {/* Strip images keep their 196:261 aspect ratio (traced from Figma)
              but the row now stretches to fill the left column's full width
              — like the heading/paragraph/button above and below it — instead
              of stopping at a narrow fixed cap. */}
          <FadeInWhenVisible
            delay={0.2}
            className="mt-8 grid w-full max-w-xl grid-cols-3 justify-items-stretch gap-3 lg:mt-10 lg:gap-5"
          >
            {STRIP_IMAGES.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[196/261] overflow-hidden rounded-lg bg-[#ececec] lg:rounded-[8px]"
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.25} className="mt-8 lg:mt-10">
            <PillButton href="#about" variant="solid">
              View More!
            </PillButton>
          </FadeInWhenVisible>
        </div>

        {/* Right column — 20px corner radius. At lg+ it's taller than the left
            column (its top edge extends above the "About Us" heading, per
            the Figma reference where the photo is 929px vs. the shorter left
            column), self-aligned to the row's top so the extra height grows
            upward instead of pushing the bottom out of alignment. */}
        <FadeInWhenVisible
          delay={0.15}
          className="relative mt-10 h-[360px] w-full self-stretch overflow-hidden rounded-[20px] sm:h-[460px] lg:mt-0 lg:h-[calc(100%+140px)] lg:self-end"
        >
          <Image
            src="/images/home/about-photo.png"
            alt="Clinical professional at work"
            fill
            className="object-cover"
          />
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
