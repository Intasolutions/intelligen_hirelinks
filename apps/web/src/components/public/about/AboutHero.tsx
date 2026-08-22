import Image from 'next/image';

export function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden lg:-mt-[90px]">
      <div className="relative aspect-[4/3] max-h-[720px] w-full sm:aspect-[16/9] lg:aspect-[2880/1200]">
        <Image
          src="/images/about/about-hero-photo.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-6 sm:pb-12 lg:px-10 lg:pb-16">
          <p
            className="bg-gradient-to-r from-white/40 to-white bg-clip-text font-display-rounded text-[13vw] font-bold uppercase leading-[0.95] text-transparent sm:text-[9vw] md:text-[7vw] lg:text-[5.5vw] lg:leading-[0.9] xl:text-[80px]"
          >
            <span className="block">About</span>
            <span className="block">Intelligen Hirelinks</span>
          </p>
        </div>
      </div>
    </section>
  );
}
