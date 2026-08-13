'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PillButton } from '../PillButton';
import { MAP_PROFILES, WorldMap } from './WorldMap';

const ROTATE_INTERVAL_MS = 3500;

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
      className="relative -mt-[90px] h-[1046px] w-full overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #b0b1b1 100%)',
      }}
    >
      <div className="relative mx-auto h-full max-w-[1440px]">
        <h2
          aria-hidden
          className="pointer-events-none absolute left-[47px] top-[41.33px] flex h-[335px] w-[1344px] select-none items-center justify-between font-display-rounded font-bold uppercase leading-none tracking-normal text-white"
          style={{ fontSize: 239 }}
        >
          {'HIRELINKS'.split('').map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </h2>

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

        <div className="absolute left-[60px] top-[649px] z-20 w-[513px]">
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
              style={{ fontSize: 17,}}  // style={{ fontSize: 20, lineHeight: '90%', letterSpacing: '1%' }}
          >
            T Purus in in fames sit ac vitae. Curabitur scelerisque nunc mauris blandit. Donec
            tristique placerat consectetur molestie est ornare. Suspendisse
          </p>

          <PillButton href="#contact" variant="solid" borderColor="#ffffff" className="mt-8">
            Register Now!
          </PillButton>
        </div>
      </div>
    </section>
  );
}
