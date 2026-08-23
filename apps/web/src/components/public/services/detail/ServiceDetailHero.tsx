import Image from 'next/image';

// Text-shadow (not a background overlay) — keeps the white desktop title
// readable on any photo without tinting/darkening the image itself.
const TEXT_SHADOW = '0 2px 12px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.7)';

export function ServiceDetailHero({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description?: string;
  imageUrl?: string;
}) {
  return (
    <section className="relative w-full overflow-hidden lg:-mt-[90px]">
      {/* Same shape as ServicesHero/AboutHero: one fixed aspect ratio at
          every breakpoint (no per-breakpoint switching), object-cover, photo
          fills edge-to-edge with zero surrounding margin. Those two heroes
          use their own local photo's exact native ratio so object-cover
          never actually needs to crop; this one uses 16:9 as the closest
          fixed stand-in since the primary image is an admin upload whose
          real ratio varies per service. */}
      <div className="relative aspect-[16/9] max-h-[720px] w-full bg-[#1a1a1a]">
        {imageUrl && <Image src={imageUrl} alt="" fill priority className="object-cover" />}

        {/* Overlaid on the image only at lg: — below that the heading moves
            into normal flow under the image instead (see below), so nothing
            sits on top of the photo on mobile/tablet. */}
        <div className="absolute inset-x-0 bottom-0 hidden px-10 pb-14 lg:block">
          <p
            className="font-display-rounded font-bold leading-[0.9] text-white"
            style={{ fontSize: 'clamp(28px, 5vw, 56px)', textShadow: TEXT_SHADOW }}
          >
            {title}
          </p>
          {description && (
            <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-white" style={{ textShadow: TEXT_SHADOW }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Below lg: heading + description sit under the (full-bleed, no
          margin) image instead of overlaid on it. */}
      <div className="bg-white px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:hidden">
        <p className="font-display-rounded text-2xl font-bold leading-[0.95] text-black sm:text-3xl">{title}</p>
        {description && (
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-black sm:mt-4 sm:text-base">{description}</p>
        )}
      </div>
    </section>
  );
}
