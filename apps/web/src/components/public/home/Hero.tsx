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
    <section className="relative overflow-hidden">
      <div
        className="relative mx-auto h-[1046px] max-w-[1440px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #b0b1b1 100%)',
        }}
      >
        <h2
          aria-hidden
          className="pointer-events-none absolute left-0 top-[100px] w-full select-none text-center text-[180px] font-black uppercase leading-none tracking-tight text-white/70"
        >
          Hirelinks
        </h2>

        <div className="absolute inset-x-0 top-[380px] h-[550px]">
          <WorldMap activeIndex={activeIndex} />
        </div>

        <div className="absolute bottom-0 left-[312px] h-[921px] w-[721px]">
          <Image
            src="/images/home/hero-doctor.png"
            alt="Healthcare professional"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        <div className="absolute left-[60px] top-[649px] w-[513px]">
          <PillButton href="#contact" variant="white">
            Talk to Expert
          </PillButton>

          <h1 className="mt-6 text-6xl font-normal leading-[1.05] text-gray-900">
            Lorem Ipsum
            <br />
            Dolor <span className="text-[#2a9d8f]">Sit Amit</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-base leading-relaxed text-gray-600">
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
