const INTRO =
  'At HigherLinks, we believe every nursing career deserves the right direction, support, and opportunity. Our programmes are designed to guide nurses through every stage of their professional journey-from career planning and skill development to recruitment, documentation, and placement. With personalised guidance and a clear understanding of each nurse’s goals, we make the path towards a successful career more structured and accessible.';

// No FadeInWhenVisible here — this paragraph sits directly under the hero
// and is part of the page's initial view, so it should render visible
// immediately rather than waiting for a scroll-into-view trigger. Same
// treatment as ServicesIntro.
export function ProgramsIntro() {
  return (
    <section className="w-full bg-white px-4 pb-8 pt-3 sm:px-6 sm:pb-12 sm:pt-4 lg:px-10 lg:pb-14 lg:pt-6">
      <div className="mx-auto max-w-[1360px]">
        <p className="max-w-3xl font-sans text-sm leading-relaxed text-black sm:text-base lg:text-lg">{INTRO}</p>
      </div>
    </section>
  );
}
