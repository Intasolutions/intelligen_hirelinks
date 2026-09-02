import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

const PARAGRAPH =
  'Our programmes provide nurses with structured pathways for career growth, professional development, recruitment, and placement. We offer dedicated support for domestic and international opportunities, including career guidance, profile assessment, documentation, credential assistance, interview preparation, recruitment coordination, licensing pathways, and relocation guidance. Each programme is designed to simplify the journey from preparation to successful placement.';

const CARD_TEXT = 'Nurses Today, Successful Careers Tomorrow.';

function Heading() {
  return (
    <FadeInWhenVisible className="flex items-center gap-2">
      <div className="relative h-[18px] w-5 shrink-0 lg:h-[30px] lg:w-[34px]">
        <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
      </div>
      <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[42px]">
        <span className="text-black">We</span> <span className="text-[#2a9d8f]">Introduce</span>
      </p>
    </FadeInWhenVisible>
  );
}

export function ProgramsIntroduceSection() {
  return (
    <section className="w-full overflow-x-hidden bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1360px]">
        {/* Below lg: heading renders here, first, above the photo — this
            copy is hidden at lg: (see the lg:hidden class below), where the
            second copy nested in the right column (further down) takes
            over instead, since only that placement can sit vertically
            level with the tall photo's own top edge once the layout
            becomes a flex-row. Rendering it twice (rather than reordering
            one copy with CSS) sidesteps fighting flex `order` across a
            column->row axis change, which doesn't reliably reposition an
            item vertically once the parent's flex-direction itself flips. */}
        <div className="lg:hidden">
          <Heading />
        </div>

        <div className="mt-6 flex flex-col gap-8 sm:mt-8 sm:gap-10 lg:mt-0 lg:flex-row lg:items-end lg:gap-10">
          {/* Tall portrait, left column. The frosted-glass caption card sits
              inside it (absolute, bottom-right), not beside it. Native
              photo ratio isn't known in advance (admin/marketing upload),
              so this uses a fixed aspect-[3/4] portrait box with
              object-cover rather than the ServicesHero/AboutHero "native
              ratio, no crop" approach — that only works when the exact
              source ratio is known ahead of time. */}
          <FadeInWhenVisible
            delay={0.05}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#ececec] sm:aspect-[4/3] lg:aspect-auto lg:h-[560px] lg:w-[42%]"
          >
            <Image
              src="/images/programs/programs-introduce-photo-tall.png"
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />

            {/* Glass-card recipe: white fill at low opacity, blur, a
                subtle border, and a layered box-shadow mixing an outer
                drop shadow with inset highlight/shade lines, plus the two
                gradient edge-lines (top + left) recreated as absolutely
                positioned 1px divs since React can't target
                pseudo-elements inline. Text inside is bottom-aligned
                (flex + mt-auto) rather than sitting at the top of the
                card. */}
            <div
              className="absolute bottom-4 right-4 flex aspect-square w-[62%] max-w-[300px] flex-col overflow-hidden rounded-[20px] p-6 sm:bottom-6 sm:right-6 sm:max-w-[320px] lg:max-w-[340px] lg:p-8"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 0px 0px rgba(255,255,255,0)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-px"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.8), transparent, rgba(255,255,255,0.3))' }}
                aria-hidden
              />
              <p className="relative mt-auto font-display-rounded text-xl font-medium leading-snug text-white sm:text-2xl lg:text-3xl">
                {CARD_TEXT}
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Right column: heading's second copy lives here, above the
              paragraph, hidden below lg (the standalone copy above takes
              over there) — visible only at lg:, where it sits level with
              the top of the tall photo as this column's own first line. */}
          <div className="flex flex-1 flex-col lg:h-[560px] lg:justify-between">
            <div className="flex flex-col items-start gap-6">
              <div className="hidden lg:block">
                <Heading />
              </div>

              <FadeInWhenVisible delay={0.1} className="max-w-xl font-sans text-sm leading-relaxed text-black/70 sm:text-base lg:text-lg">
                {PARAGRAPH}
              </FadeInWhenVisible>
            </div>

            {/* Button sits on the same row as the small photo, both
                anchored to the bottom of the column — lands on the same
                baseline as the tall photo (via the row's lg:items-end) and
                the small photo, instead of floating up near the
                paragraph. */}
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between lg:mt-0">
              <FadeInWhenVisible delay={0.15}>
                <PillButton href="/contact" variant="solid" bgColor="#000000" textColor="#ffffff">
                  Contact Now!
                </PillButton>
              </FadeInWhenVisible>

              <FadeInWhenVisible
                delay={0.2}
                className="relative aspect-[4/3] w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#ececec] sm:max-w-xs lg:h-[280px] lg:w-[280px] lg:max-w-none"
              >
                <Image
                  src="/images/programs/programs-introduce-photo-small.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 280px, 40vw"
                />
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
