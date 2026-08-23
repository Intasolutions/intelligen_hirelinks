import Image from 'next/image';
import { FadeInWhenVisible } from '../../FadeInWhenVisible';

export interface ServiceBenefitItem {
  heading: string;
  description?: string;
  displayOrder: number;
}

// Alternates the same two gradient fills CoreValuesSection uses site-wide
// for "value card" treatments, so this reads as the same visual language
// rather than inventing a third palette.
const VARIANT_STYLE = [
  'bg-gradient-to-b from-[#0D796C] to-[#2A9D8F] text-white',
  'bg-gradient-to-b from-[#2f7ab8] to-[#0e2f4d] text-white',
];

export function ServiceBenefitsSection({
  heading,
  description,
  items,
  secondaryImageUrl,
  secondaryImageAlt,
}: {
  heading?: string;
  description?: string;
  items: ServiceBenefitItem[];
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
}) {
  if (items.length === 0 && !description && !secondaryImageUrl) return null;

  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="w-full bg-[#fafafa] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center gap-2">
          <span className="font-sans text-lg font-bold text-[#2a9d8f] sm:text-xl">//</span>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[42px]">
            {heading || 'Technical & Operational Benefits'}
          </p>
        </FadeInWhenVisible>

        {description && (
          <FadeInWhenVisible delay={0.05} className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-black sm:mt-6 sm:text-base lg:text-lg">
            {description}
          </FadeInWhenVisible>
        )}

        <div className="mt-8 flex flex-col gap-8 sm:mt-10 lg:mt-12 lg:flex-row lg:items-start lg:gap-10">
          {sorted.length > 0 && (
            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
              {sorted.map((item, i) => (
                <FadeInWhenVisible key={`${item.heading}-${i}`} delay={0.1 + i * 0.05}>
                  <div
                    className={`flex h-full min-h-[160px] flex-col justify-between rounded-2xl p-6 ${VARIANT_STYLE[i % VARIANT_STYLE.length]}`}
                  >
                    <p className="font-display-rounded text-lg font-bold">{item.heading}</p>
                    {item.description && (
                      <p className="mt-4 font-sans text-sm leading-relaxed text-white/80">{item.description}</p>
                    )}
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          )}

          {secondaryImageUrl && (
            <FadeInWhenVisible
              delay={0.2}
              className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-[#ececec] lg:aspect-auto lg:h-[420px] lg:w-[380px]"
            >
              <Image src={secondaryImageUrl} alt={secondaryImageAlt || ''} fill className="object-cover" />
            </FadeInWhenVisible>
          )}
        </div>
      </div>
    </section>
  );
}
