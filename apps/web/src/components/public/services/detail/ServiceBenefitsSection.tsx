import Image from 'next/image';
import { FadeInWhenVisible } from '../../FadeInWhenVisible';

export interface ServiceBenefitItem {
  heading: string;
  description?: string;
  displayOrder: number;
}

function numberLabel(i: number) {
  return String(i + 1).padStart(2, '0');
}

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

  // Two-tone heading split — last word in teal, matching the same
  // black/teal pattern every other section heading on the site uses
  // (e.g. "Our Popular Services", FaqAccordion's own heading split).
  const fullHeading = heading || 'Operational Benefits';
  const accent = fullHeading.slice(fullHeading.lastIndexOf(' ') + 1);
  const lead = fullHeading.slice(0, fullHeading.length - accent.length).trimEnd();

  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center gap-2">
          <span className="font-sans text-lg font-bold text-[#2a9d8f] sm:text-xl">//</span>
          <p className="font-display-rounded text-2xl font-bold leading-tight sm:text-3xl lg:text-[42px]">
            {lead && <span className="text-black">{lead} </span>}
            <span className="text-[#2a9d8f]">{accent}</span>
          </p>
        </FadeInWhenVisible>

        {description && (
          <FadeInWhenVisible delay={0.05} className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-black/70 sm:mt-6 sm:text-base lg:text-lg">
            {description}
          </FadeInWhenVisible>
        )}

        <div className="mt-6 flex flex-col gap-6 sm:mt-8 lg:mt-8 lg:flex-row lg:items-stretch lg:gap-8">
          {secondaryImageUrl && (
            <FadeInWhenVisible
              delay={0.1}
              className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-[#ececec] lg:aspect-auto lg:w-[42%]"
            >
              <Image
                src={secondaryImageUrl}
                alt={secondaryImageAlt || ''}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </FadeInWhenVisible>
          )}

          {sorted.length > 0 && (
            <FadeInWhenVisible
              delay={0.15}
              className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white"
            >
              {/* Two soft decorative glows, top-right and bottom-left corners
                  of the whole grid — purely ornamental, not tied to any card
                  or interaction. */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(42,157,143,0.35) 0%, rgba(59,130,246,0.15) 55%, transparent 75%)' }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(42,157,143,0.35) 0%, rgba(59,130,246,0.15) 55%, transparent 75%)' }}
                aria-hidden
              />

              {/* Every internal line is an explicit border on the cell that
                  owns it — no divide-y/divide-x utilities, since those add a
                  border-top-width to all children as a group and fight with
                  the sm:border-t override on specific cells at the same
                  breakpoint (same property, same specificity, source-order
                  dependent — the horizontal rule was silently losing that
                  fight). Below sm: every cell after the first gets a plain
                  top border (single column, so this is simply every row
                  boundary). At sm: 2-column grid — left-column cells (even
                  index) get a right border, and every cell from the second
                  row on (index >= 2) gets a top border, matching the outer
                  box's own border weight/color so it reads as one
                  consistent grid line, not a fainter afterthought. */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2">
                {sorted.map((item, i) => (
                  <div
                    key={`${item.heading}-${i}`}
                    className={`group flex flex-col gap-3 border-[#e5e5e5] p-6 transition-colors duration-300 hover:bg-[#2a9d8f]/[0.04] sm:p-8 ${
                      i > 0 ? 'border-t' : ''
                    } ${i % 2 === 0 ? 'sm:border-r' : ''} ${i >= 2 ? 'sm:border-t' : 'sm:border-t-0'}`}
                  >
                    <p className="font-display-rounded text-3xl font-bold text-black/15 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#2a9d8f]/25 sm:text-4xl">
                      {numberLabel(i)}
                    </p>
                    <p className="font-display-rounded text-base font-bold text-black">{item.heading}</p>
                    {item.description && (
                      <p className="font-sans text-sm leading-relaxed text-black/60">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </FadeInWhenVisible>
          )}
        </div>
      </div>
    </section>
  );
}
