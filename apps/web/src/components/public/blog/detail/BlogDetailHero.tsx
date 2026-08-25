import Image from 'next/image';

// Cycles through the site's brand palette for tag pills — the reference
// shows each tag in a different soft color, not one flat style repeated.
const TAG_STYLES = [
  { bg: '#F3E8FF', text: '#7C3AED' },
  { bg: '#E0E7FF', text: '#4338CA' },
  { bg: '#FCE7F3', text: '#BE185D' },
  { bg: '#DCFCE7', text: '#15803D' },
  { bg: '#FEF3C7', text: '#B45309' },
];

function formatPublishedDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Same split every other heading on the site uses (FaqAccordion,
// ServiceBenefitsSection, PopularServicesCarousel, ...): only the last word
// goes teal, the rest stays black as one natural sentence — splitting the
// title in half by word count instead was wrapping the teal portion onto
// its own line mid-sentence, which reads as broken rather than styled.
function splitHeading(title: string) {
  const accent = title.slice(title.lastIndexOf(' ') + 1);
  const lead = title.slice(0, title.length - accent.length).trimEnd();
  return { lead, accent };
}

export function BlogDetailHero({
  title,
  subTitle,
  tags,
  publishedAt,
  imageUrl,
  imageAlt,
}: {
  title: string;
  subTitle?: string;
  tags?: string[];
  publishedAt?: string | null;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const publishedLabel = formatPublishedDate(publishedAt);
  const { lead, accent } = splitHeading(title);

  return (
    <section className="w-full bg-white px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-10 lg:pb-14 lg:pt-16">
      <div className="mx-auto max-w-4xl text-center">
        {publishedLabel && (
          <p className="font-sans text-sm font-semibold text-[#2a67cc] sm:text-base">Published {publishedLabel}</p>
        )}

        <p className="mt-3 flex items-center justify-center gap-2 font-display-rounded text-2xl font-bold leading-tight sm:mt-4 sm:text-3xl lg:text-[42px]">
          <span className="relative h-[18px] w-5 shrink-0 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </span>
          <span>
            {lead && <span className="text-black">{lead} </span>}
            <span className="text-[#2a9d8f]">{accent}</span>
          </span>
        </p>

        {subTitle && (
          <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-black/70 sm:mt-6 sm:text-lg">
            {subTitle}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6">
            {tags.map((tag, i) => {
              const style = TAG_STYLES[i % TAG_STYLES.length];
              return (
                <span
                  key={tag}
                  className="rounded-full px-3.5 py-1.5 font-sans text-xs font-medium sm:text-sm"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-2xl bg-[#ececec] sm:mt-10 lg:mt-12">
          <Image src={imageUrl} alt={imageAlt || ''} fill priority className="object-cover" sizes="(min-width: 1024px) 1152px, 100vw" />
        </div>
      )}
    </section>
  );
}
