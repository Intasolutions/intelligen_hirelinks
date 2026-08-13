'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PillButton } from '../PillButton';

const PROFILES = [
  { name: 'Olivia Williams', country: 'India', image: '/images/home/badge_4_India.png', top: 451, right: 261 },
  { name: 'Rachel McDermott', country: 'Brazil', image: '/images/home/badge_3_Brazil.png', top: 343, right: 940 },
  { name: 'Angelina David', country: 'Australia', image: '/images/home/badge_2_australia.png', top: 451, right: 176 },
  { name: 'Catherine Meg', country: 'USA', image: '/images/home/badge_1_USA.png', top: 76, right: 1124 },
];

const ROTATE_INTERVAL_MS = 3500;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROFILES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f2f2] to-[#e2e2e2]">
      <div className="relative mx-auto h-[1046px] max-w-[1440px]">
        <Image
          src="/images/home/hero-visual.png"
          alt=""
          fill
          priority
          className="pointer-events-none select-none object-cover object-top"
        />

        <div className="absolute bottom-0 left-[312px] h-[921px] w-[721px]">
          <Image
            src="/images/home/hero-doctor.png"
            alt="Healthcare professional"
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        {PROFILES.map((profile, i) => (
          <div
            key={profile.name}
            className="absolute w-[125px] transition-opacity duration-700 ease-in-out"
            style={{
              top: profile.top,
              right: profile.right,
              opacity: i === activeIndex ? 1 : 0,
              pointerEvents: i === activeIndex ? 'auto' : 'none',
            }}
          >
            <Image
              src={profile.image}
              alt={`${profile.name}, ${profile.country}`}
              width={125}
              height={127}
              className="h-auto w-full rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            />
          </div>
        ))}

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
