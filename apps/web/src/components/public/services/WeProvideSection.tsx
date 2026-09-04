import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

const PARAGRAPH1 ='We provide comprehensive career and placement support designed to connect nurses with trusted healthcare opportunities worldwide. From personalized career guidance and professional development programmes to recruitment support, documentation assistance, and domestic and international placements, we make every step of the journey clear, simple, and stress-free.'
const PARAGRAPH2 ='With dedicated support at every stage, we help nurses identify the right opportunities, make informed career decisions, and navigate the placement process with confidence. Our commitment goes beyond placement-we aim to support every nurse in building a successful, stable, and rewarding career with long-term professional growth.'
function Photo({ src, className, delay = 0 }: { src: string; className: string; delay?: number }) {
  return (
    <FadeInWhenVisible delay={delay} className={`relative shrink-0 overflow-hidden rounded-[14px] bg-[#ececec] ${className}`}>
      <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 1024px) 345px, 100vw" />
    </FadeInWhenVisible>
  );
}

export function WeProvideSection() {
  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center gap-2">
          <div className="relative mt-1.5 h-[18px] w-[20px] shrink-0 lg:mt-2.5 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            <span className="text-black">We</span> <span className="text-[#2a9d8f]">Provide</span>
          </p>
        </FadeInWhenVisible>

        {/* Desktop (lg:): the tall photo is self-stretch on an items-start
            row, so it grows to match the right column's full rendered
            height — its top lines up with paragraph 1 / the small photo
            (the row's shared top edge), and because it stretches rather
            than using a fixed height, its bottom also lands exactly at the
            right column's bottom. The right column's own rows sit close
            together on a fixed gap (not justify-between) so short copy
            doesn't get stretched apart into a large empty middle gap —
            the tall photo is what fills the leftover height, not the text
            rows. Below lg: the tall photo (a wide sidebar treatment that
            only makes sense alongside that much vertical content) is
            dropped entirely.

            Mobile/tablet layout: each paragraph is paired side-by-side with
            its photo (not stacked full-width) — a fixed, deliberately
            small photo size (128px mobile, 160px sm:) next to the text, so
            neither the photo dominates the screen nor the text gets pushed
            below the fold before the second paragraph is even reached. */}
        <div className="mt-6 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start lg:gap-10">
          <Photo
            src="/images/services/we-provide-photo-tall.png"
            className="hidden lg:block lg:aspect-auto lg:w-[345px] lg:self-stretch"
            delay={0.05}
          />

          <div className="flex flex-col gap-8 lg:flex-1 lg:gap-10">
            <div className="flex flex-row items-center gap-4 sm:gap-6 lg:items-start lg:justify-start lg:gap-10">
              <FadeInWhenVisible delay={0.1} className="min-w-0 max-w-md flex-1 font-sans text-sm leading-relaxed text-black sm:text-base lg:max-w-xl lg:flex-none lg:text-lg">
                {PARAGRAPH1}
              </FadeInWhenVisible>

              <Photo
                src="/images/services/we-provide-photo-small.png"
                className="aspect-[238/238] w-28 shrink-0 sm:w-40 lg:h-[238px] lg:w-[238px]"
                delay={0.15}
              />
            </div>

            <div className="flex flex-row-reverse items-center gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-start lg:gap-10">
              <Photo
                src="/images/services/we-provide-photo-square.png"
                className="aspect-[284/387] w-28 shrink-0 sm:w-40 lg:h-[387px] lg:w-[284px]"
                delay={0.2}
              />
              <div className="flex min-w-0 flex-1 flex-col items-start gap-6 lg:max-w-xl lg:flex-none">
                <FadeInWhenVisible delay={0.25} className="font-sans text-sm leading-relaxed text-black sm:text-base lg:text-lg">
                  {PARAGRAPH2}
                </FadeInWhenVisible>
                <FadeInWhenVisible delay={0.3} className="hidden lg:block">
                  <PillButton href="/services" variant="white" borderColor="#2a9d8f">
                    Explore Services
                  </PillButton>
                </FadeInWhenVisible>
              </div>
            </div>

            <FadeInWhenVisible delay={0.3} className="lg:hidden">
              <PillButton href="/services" variant="white" borderColor="#2a9d8f">
                Explore Services
              </PillButton>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>
    </section>
  );
}
