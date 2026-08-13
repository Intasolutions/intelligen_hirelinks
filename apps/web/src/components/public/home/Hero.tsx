'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PillButton } from '../PillButton';
import { ScaledStage } from '../ScaledStage';
import { MAP_PROFILES, WorldMap } from './WorldMap';

const ROTATE_INTERVAL_MS = 3500;
const STAGE_WIDTH = 1440;
const STAGE_HEIGHT = 1046;

function HirelinksWatermark({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      aria-hidden
      className={`pointer-events-none flex select-none justify-between font-display-rounded font-bold uppercase leading-none tracking-normal text-white ${className}`}
      style={style}
    >
      {'HIRELINKS'.split('').map((letter, i) => (
        <span key={i}>{letter}</span>
      ))}
    </h2>
  );
}

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MAP_PROFILES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden lg:-mt-[90px]"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #b0b1b1 100%)',
      }}
    >
      {/* Mobile/tablet only: sits in the clear space above the photo instead of
          crossing behind it at the scaled-down desktop position. Top padding
          clears the absolutely-positioned floating header/pill above it. */}
      <HirelinksWatermark
        className="mx-auto w-full max-w-[500px] items-center px-4 pt-20 lg:hidden"
        style={{ fontSize: '15vw', lineHeight: 0.85, marginBottom: '-13vw' }}
      />

      <ScaledStage width={STAGE_WIDTH} height={STAGE_HEIGHT} className="mx-auto max-w-[1440px]">
        <HirelinksWatermark
          className="absolute left-[47px] top-[41.33px] hidden h-[335px] w-[1344px] items-center lg:flex"
          style={{ fontSize: 239 }}
        />

        <div className="absolute inset-x-0 top-[340px] z-0 w-full">
          <WorldMap activeIndex={activeIndex} />
        </div>

        <div className="absolute bottom-0 left-[312px] z-10 h-[921px] w-[721px]">
          <Image
            src="/images/home/hero-doctor.png"
            alt="Healthcare professional"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        <div className="absolute left-[60px] top-[649px] z-20 hidden w-[513px] lg:block">
          <PillButton href="#contact" variant="white">
            Talk to Expert
          </PillButton>

          <h1
            className="mt-6 w-[513px] font-medium normal text-gray-900"
            style={{ fontSize: 68, lineHeight: '110%' }}
          >
            Lorem Ipsum
            <br />
            Dolor <span className="font-bold text-[#2a9d8f]">Sit Amit</span>
          </h1>

          <p
            className="mt-6 w-[613px] font-sans font-medium text-black"
            style={{ fontSize: 17 }}
          >
            T Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec
            tristique placerat consectetur molestie est ornare. Suspendisse
          </p>

          <PillButton href="#contact" variant="solid" borderColor="#ffffff" className="mt-8">
            Register Now!
          </PillButton>
        </div>
      </ScaledStage>

      {/* Mobile/tablet only: same content as the desktop block above, but at
          real readable sizes instead of scaled down with the photo/map. */}
      <div className="px-5 pb-10 pt-6 lg:hidden">
        <h1 className="text-4xl font-medium leading-[1.1] text-gray-900 sm:text-5xl">
          Lorem Ipsum
          <br />
          Dolor <span className="font-bold text-[#2a9d8f]">Sit Amit</span>
        </h1>

        <p className="mt-4 font-sans text-base font-medium leading-relaxed text-black">
          T Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec
          tristique placerat consectetur molestie est ornare. Suspendisse
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PillButton href="#contact" variant="white">
            Talk to Expert
          </PillButton>

          <PillButton href="#contact" variant="solid" borderColor="#ffffff">
            Register Now!
          </PillButton>
        </div>
      </div>
    </section>
  );
}
