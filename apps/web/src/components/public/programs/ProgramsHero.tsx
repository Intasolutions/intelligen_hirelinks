import Image from 'next/image';

export function ProgramsHero() {
  return (
    <section className="relative w-full overflow-hidden lg:-mt-[90px]">
      {/* Native aspect ratio (5760x3444, ~1.673) at every breakpoint, not a
          different ratio per breakpoint — object-cover still crops the
          moment the box ratio differs even slightly from the source, so
          matching the box to the photo's own ratio throughout is what
          actually keeps the whole image visible with nothing cut off. Same
          treatment as ServicesHero/AboutHero. */}
      <div className="relative aspect-[5760/3444] max-h-[720px] w-full">
        <Image
          src="/images/programs/programs-hero-photo.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-12 lg:px-10 lg:pb-16">
          {/* Same clamp() approach as ServicesHero/AboutHero — a pure vw
              size has no floor, so on a narrow phone (where this hero is
              also shorter now that it uses the photo's own un-cropped
              aspect ratio) the text would be sized too large for the
              available box. */}
          <p
            className="bg-gradient-to-r from-white/40 to-white bg-clip-text font-display-rounded font-bold uppercase leading-[0.95] text-transparent lg:leading-[0.9]"
            style={{ fontSize: 'clamp(26px, 7vw, 80px)' }}
          >
            <span className="block">Our</span>
            <span className="block">Popular Programs</span>
          </p>
        </div>
      </div>
    </section>
  );
}
