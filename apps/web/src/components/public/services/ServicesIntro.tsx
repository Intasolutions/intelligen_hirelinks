const INTRO =
  'At Intelligen Hirelinks, we provide trusted career and placement services designed to support nurses at every stage. From professional guidance and recruitment to domestic and international placements, our dedicated team helps nurses discover opportunities, navigate every process, and build successful careers with confidence, clarity, and lasting support.';

// No FadeInWhenVisible here — this paragraph sits directly under the hero
// and is part of the page's initial view, so it should render visible
// immediately rather than waiting for a scroll-into-view trigger.
export function ServicesIntro() {
  return (
    <section className="w-full bg-white px-4 pb-8 pt-3 sm:px-6 sm:pb-12 sm:pt-4 lg:px-10 lg:pb-14 lg:pt-6">
      <div className="mx-auto max-w-[1360px]">
        <p className="max-w-3xl font-sans text-sm leading-relaxed text-black sm:text-base lg:text-lg">{INTRO}</p>
      </div>
    </section>
  );
}
