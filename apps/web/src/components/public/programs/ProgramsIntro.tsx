const INTRO =
  'Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volutpat Bibendum Est Mattis. Sed Neque Etiam Morbi A Amet Lacus Phasellus Ipsum Nec.';

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
