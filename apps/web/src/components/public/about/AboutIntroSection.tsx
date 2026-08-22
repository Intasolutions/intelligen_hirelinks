import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

const SIDE_PARAGRAPH =
  'Lorem Ipsum Dolor Sit Amet Consectetur. Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse Aliquet Semper Quam Volut';

const CARD_QUOTE = 'Lorem ipsum dolor sit amet consectetur.';

export function AboutIntroSection() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      {/* The grey isn't full-bleed — it's this box's own background, and the
          box carries its own padding around all the content, not just the
          outer section padding around the box itself. */}
      <div
        className="mx-auto max-w-[1360px] rounded-[24px] bg-[#f6f6f6] p-6 sm:p-8 lg:p-12"
        style={{ containerType: 'inline-size' }}
      >
        {/* One row, two columns, stretched to equal height at lg (default
            flex `items-stretch`) — that shared height is what lets the right
            column push its lower content down to line up with the left
            column's bottom, instead of the two boxes trailing after both
            columns in a row of their own (which is what put them far below
            everything with a wall of empty space beside them). */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          {/* Left: big heading with an inline photo mid-sentence, CTA, and a
              second paragraph underneath. */}
          <div className="flex max-w-2xl flex-col items-start lg:flex-1">
            <FadeInWhenVisible>
              <p
                className="font-sans font-normal leading-[1.28] text-black"
                style={{ fontSize: 'clamp(30px, 4.7cqw, 56px)' }}
              >
                Lorem ipsum dolor sit amet consectetur.{' '}
                {/* Same pill-photo treatment as StatsSection's PillPhoto on
                    the homepage — same image, same inline-block/rounded-full/
                    object-cover/vertical-align:middle pattern — sized to its
                    own real aspect ratio (320:108) rather than a guessed one. */}
                <span
                  className="relative inline-block w-[2.6em] shrink-0 overflow-hidden rounded-full bg-[#ececec]"
                  style={{ aspectRatio: '320/108', verticalAlign: 'middle' }}
                >
                  <Image src="/images/home/stats-pill-photo.png" alt="" fill className="object-cover" />
                </span>{' '}
                quisque nunc tellus massa sit amet.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1} className="mt-8 lg:mt-10">
              <PillButton href="/services" variant="white" borderColor="#e5e5e5">
                Explore Services
              </PillButton>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.15} className="mt-8 max-w-md font-sans text-sm leading-relaxed text-[#5c5c5c] lg:mt-10 lg:text-base">
              {SIDE_PARAGRAPH}
            </FadeInWhenVisible>
          </div>

          {/* Right: the short paragraph up top, then the two boxes filling
              the rest of this column's height — `mt-auto` on their wrapper
              pushes them down to sit level with the left column's bottom
              (the paragraph above), landing them in the space beside the
              button/paragraph rather than below the whole left column. */}
          <div className="flex flex-col lg:w-1/2 lg:shrink-0 lg:items-end">
            {/* Right-aligned — both the block itself (against the column's
                right edge, via lg:items-end above) and the text within it
                (text-right), matching the reference: its right edge lines up
                with the boxes' right edge below it, not sitting wherever
                max-w-sm happens to land from the left. */}
            <FadeInWhenVisible delay={0.1} className="max-w-sm font-sans text-sm leading-relaxed text-[#5c5c5c] lg:text-right lg:text-base">
              {SIDE_PARAGRAPH}
            </FadeInWhenVisible>

            {/* Always side by side, at every screen size, never stacked;
                both stay `aspect-square` so their bottom edges align with
                each other by construction (equal width in the same row ->
                equal height, same size as each other at every breakpoint).
                They shrink together on narrow screens, down to a floor that
                keeps them legible, rather than wrapping to their own lines.
                lg:w-full counters the parent's lg:items-end (added for the
                paragraph above) — without it this would shrink to its
                content's natural width instead of spanning the column, which
                would make the aspect-square children's sizing circular. */}
            <div className="mt-10 flex w-full min-w-[260px] lg:mt-auto lg:w-full" style={{ gap: 'clamp(12px, 3.7cqw, 60px)' }}>
              <FadeInWhenVisible delay={0.2} className="flex-1">
                {/* `aspect-square` is a sizing hint, not a hard cap — if this
                    box's own content (the quote text) needed more room than
                    the square allowed, it would push the box taller than its
                    sibling, breaking "both boxes are the same size". Fixed
                    was: its own container-query context, with the quote text
                    and avatar strip sized in `cqw` off the BOX's own width
                    (not the outer section's), so they scale down together and
                    always fit whatever size the square actually is — plus
                    `overflow-hidden` as a hard backstop either way. */}
                <div
                  className="flex aspect-square w-full flex-col justify-between overflow-hidden rounded-[20px] bg-[#323232]"
                  style={{ containerType: 'inline-size', padding: 'clamp(8px, 5cqw, 32px)' }}
                >
                  <p
                    className="font-sans leading-tight text-white"
                    style={{ fontSize: 'clamp(12px, 12.5cqw, 34px)' }}
                  >
                    {CARD_QUOTE}
                  </p>

                  {/* Pre-composed overlapping avatar stack, saved as one image
                      rather than 8 separate files — sized to its own real aspect
                      ratio (998:172) so it doesn't stretch. */}
                  <div className="relative w-[75%]" style={{ aspectRatio: '998/172' }}>
                    <Image src="/images/about/avatar.png" alt="" fill className="object-contain object-left" />
                  </div>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.25} className="flex-1">
                <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#ececec] lg:rounded-[24px]">
                  <Image src="/images/about/intro-side-photo.png" alt="" fill className="object-cover" />
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
