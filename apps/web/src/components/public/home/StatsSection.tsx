import Image from 'next/image';
import { CountUpNumber } from '../CountUpNumber';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { ScaledStage } from '../ScaledStage';

const STAGE_WIDTH = 1440;
const STAGE_HEIGHT = 620;

const STATS = [
  { value: 6, suffix: 'K+', label: 'Nurses Enrolled' },
  { value: 4, suffix: 'K+', label: 'Nurses Placed' },
  { value: 25, suffix: '+', label: 'Countries Connected' },
];

// Mask size/position as percentages of the K logomark's own box (491/611 wide,
// 389.584/407 tall, offset 17px down within a 407px-tall box) so it scales
// with whatever container it's placed in instead of a fixed desktop pixel size.
const K_MASK_STYLE = {
  maskImage: 'url(/images/home/stats-k-mask.png)',
  maskRepeat: 'no-repeat',
  maskPosition: `0% ${(17 / 407) * 100}%`,
  maskSize: `${(491 / 611) * 100}% ${(389.584 / 407) * 100}%`,
  WebkitMaskImage: 'url(/images/home/stats-k-mask.png)',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: `0% ${(17 / 407) * 100}%`,
  WebkitMaskSize: `${(491 / 611) * 100}% ${(389.584 / 407) * 100}%`,
} as const;

function KLogomark({ className = '' }: { className?: string }) {
  return (
    // Outer box reserves right/bottom space for the shadow layer's translate
    // offset, so the visible content (K shape + shadow together) is what
    // ends up centered by the parent's mx-auto — not just the K shape alone
    // with the shadow spilling outside the centered box.
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 right-3 bottom-3">
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#d9d9d9]" style={K_MASK_STYLE} />
        <div className="relative size-full" style={K_MASK_STYLE}>
          <Image src="/images/home/stats-skyline-2.png" alt="City skyline" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function PillPhoto({ style }: { style?: React.CSSProperties }) {
  return (
    <span
      className="relative ml-1 mr-1.5 inline-block shrink-0 overflow-hidden rounded-full"
      style={{ verticalAlign: 'middle', ...style }}
    >
      <Image src="/images/home/stats-pill-photo.png" alt="" fill className="object-cover" />
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Desktop: exact Figma-positioned composition, uniformly scaled. */}
      <div className="hidden lg:block">
        <ScaledStage width={STAGE_WIDTH} height={STAGE_HEIGHT} className="mx-auto max-w-[1440px]">
          <FadeInWhenVisible
            className="absolute left-[60px] top-[80px] h-[30px] w-[34px]"
          >
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </FadeInWhenVisible>
          <FadeInWhenVisible
            className="absolute left-[102px] top-[64px] whitespace-nowrap font-display-rounded font-bold text-black"
            style={{ fontSize: 42 }}
            delay={0.05}
          >
            Lorem Ipsum <span className="text-[#2a9d8f]">Dolor Sit Amit</span>
          </FadeInWhenVisible>

          <FadeInWhenVisible
            className="absolute left-[70px] top-[161px] h-[407px] w-[611px]"
            delay={0.15}
          >
            <KLogomark className="size-full" />
          </FadeInWhenVisible>

          <FadeInWhenVisible
            className="absolute left-[715px] top-[178px] w-[665px] font-sans font-normal text-black"
            style={{ fontSize: 38, lineHeight: 1.18 }}
            delay={0.2}
          >
            Lorem ipsum dolor sit amet consectetur.
            <PillPhoto style={{ height: '0.7em', width: 'calc(0.7em * 80 / 27)' }} />
            <span className="text-black/25">
              quisque nunc tellus massa sit amet. Volutpat condimentum mattis sollicitudin
              ultricies nisl est tellus.
            </span>
          </FadeInWhenVisible>

          <div className="absolute left-[715px] top-[436px] h-px w-[665px] bg-[#d9d9d9]" />

          {STATS.map((stat, i) => (
            <FadeInWhenVisible
              key={stat.label}
              className="absolute top-[470px] flex flex-col items-start gap-3.5"
              style={{ left: [715, 944, 1173][i] }}
              delay={0.25 + i * 0.1}
            >
              <p className="font-display-rounded font-bold text-black" style={{ fontSize: 60 }}>
                <CountUpNumber value={stat.value} />
                <span className="text-[#2a9d8f]">{stat.suffix}</span>
              </p>
              <p className="font-sans text-[20px] font-medium leading-[1.18] text-[#818181]">
                {stat.label}
              </p>
            </FadeInWhenVisible>
          ))}
        </ScaledStage>
      </div>

      {/* Mobile/tablet: same content, stacked in normal flow at real readable sizes. */}
      <div className="px-5 py-12 lg:hidden">
        <FadeInWhenVisible className="flex items-center gap-3">
          <div className="relative h-[22px] w-[25px] shrink-0">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-2xl font-bold text-black sm:text-3xl">
            Lorem Ipsum <span className="text-[#2a9d8f]">Dolor Sit Amit</span>
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <KLogomark className="mx-auto mt-3 aspect-[611/407] w-full max-w-[420px]" />
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.2}>
          <p className="mt-8 font-sans text-lg font-normal leading-snug text-black">
            Lorem ipsum dolor sit amet consectetur.
            <PillPhoto style={{ height: '1.1em', width: 'calc(1.1em * 80 / 27)' }} />
            <span className="text-black/25">
              quisque nunc tellus massa sit amet. Volutpat condimentum mattis sollicitudin
              ultricies nisl est tellus.
            </span>
          </p>
        </FadeInWhenVisible>

        <div className="mt-8 h-px w-full bg-[#d9d9d9]" />

        <div className="mt-8 grid grid-cols-3 gap-4">
          {STATS.map((stat, i) => (
            <FadeInWhenVisible
              key={stat.label}
              className="flex flex-col items-start gap-2"
              delay={0.25 + i * 0.1}
            >
              <p className="font-display-rounded text-3xl font-bold text-black sm:text-4xl">
                <CountUpNumber value={stat.value} />
                <span className="text-[#2a9d8f]">{stat.suffix}</span>
              </p>
              <p className="font-sans text-sm font-medium leading-tight text-[#818181]">
                {stat.label}
              </p>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
}
