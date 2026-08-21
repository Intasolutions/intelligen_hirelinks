import Image from 'next/image';
import { FadeInWhenVisible } from '../FadeInWhenVisible';

const LEAD_IN = 'Lorem Ipsum Dolor Sit Amet Consectetur.';
const REST =
  'Quisque Nunc Tellus Massa Sit Amet. Volutpat Condimentum Mattis Sollicitudin Ultricies Nisl Est Tellus';

/**
 * Closing "mission" band, built to the 1440x960 reference composition:
 *
 *   - a blurred stethoscope shape fills the whole band,
 *   - the paragraph sits top-left over it (black lead-in, the rest at 25% black),
 *   - "HIRELINKS" is a near-invisible white watermark along the bottom edge,
 *   - the nurse cut-out stands centred on top of both, flush with the bottom.
 *
 * Everything inside the frame is expressed as a percentage of the frame, and
 * type is sized in `cqw` (container width) rather than `vw`, so the whole
 * composition scales as one unit — including once the frame stops growing at
 * its 1600px cap.
 */
export function MissionSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Blurred decorative shape — full-bleed behind the frame. */}
      <Image
        src="/images/home/mission-decorative-shape.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-[1600px] sm:aspect-[3/2]"
        style={{ containerType: 'inline-size' }}
      >
        {/* Paragraph — bottom layer; the photo overlaps its middle. */}
        <FadeInWhenVisible className="absolute inset-x-[4.1667%] top-[6%] z-10 sm:top-[13.5%]">
          <p className="font-sans text-[7.6cqw] font-normal uppercase leading-[1.193] text-black sm:text-[5.415cqw]">
            {LEAD_IN} <span className="text-black/25">{REST}</span>
          </p>
        </FadeInWhenVisible>

        {/* "HIRELINKS" watermark — baseline sits on the bottom edge of the
            frame. Sits above the photo, so it reads across the nurse's lower
            body as well as the dark part of the blur (white at 10%). */}
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 select-none whitespace-nowrap text-center font-display-rounded text-[16.45cqw] font-bold uppercase leading-[0.85] text-white/10"
        >
          HIRELINKS
        </p>

        {/* Nurse cut-out — top layer, centred, and bottom-anchored so the
            photo's edge and the section's edge are the same line (no gap). */}
        <div className="absolute bottom-0 left-1/2 z-30 aspect-[700/931] h-[70%] -translate-x-1/2 sm:h-[96.7%]">
          <FadeInWhenVisible delay={0.15} distance={0} className="relative h-full w-full">
            <Image
              src="/images/home/mission-nurse-photo.png"
              alt="Nurse in scrubs"
              fill
              sizes="(max-width: 640px) 70vw, 50vw"
              className="object-contain object-bottom"
            />
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
}
