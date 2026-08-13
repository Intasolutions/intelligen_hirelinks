'use client';

import Image from 'next/image';

// Base map frame is 1387x706 in Figma's own coordinate space (node "XMLID_465_").
// Each country highlight below was exported as its own tight-cropped SVG; x/y are
// that shape's position within the base map frame, read from Figma's Design panel.
const MAP_WIDTH = 1387;
const MAP_HEIGHT = 706;

export interface MapProfile {
  name: string;
  country: string;
  image: string;
  highlight: { src: string; x: number; y: number; width: number; height: number };
}

export const MAP_PROFILES: MapProfile[] = [
  {
    name: 'Olivia Williams',
    country: 'India',
    image: '/images/home/badge_4_India.png',
    highlight: { src: '/images/home/hero-map-india.svg', x: 968.88, y: 235.22, width: 137, height: 153 },
  },
  {
    name: 'Rachel McDermott',
    country: 'Brazil',
    image: '/images/home/badge_3_Brazil.png',
    highlight: { src: '/images/home/hero-map-brazil.svg', x: 283.28, y: 402.73, width: 191, height: 217 },
  },
  {
    name: 'Angelina David',
    country: 'Australia',
    image: '/images/home/badge_2_australia.png',
    highlight: { src: '/images/home/hero-map-australia.svg', x: 1178.87, y: 492.34, width: 193, height: 156 },
  },
  {
    name: 'Catherine Meg',
    country: 'USA',
    image: '/images/home/badge_1_USA.png',
    highlight: { src: '/images/home/hero-map-usa.svg', x: 87.05, y: 160.05, width: 270, height: 133 },
  },
];

interface WorldMapProps {
  activeIndex: number;
}

export function WorldMap({ activeIndex }: WorldMapProps) {
  return (
    <div className="relative h-full w-full" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      <Image
        src="/images/home/hero-map-base.svg"
        alt=""
        fill
        className="pointer-events-none select-none object-contain"
      />

      {MAP_PROFILES.map((profile, i) => (
        <div
          key={profile.name}
          className="absolute transition-opacity duration-700 ease-in-out"
          style={{
            left: `${(profile.highlight.x / MAP_WIDTH) * 100}%`,
            top: `${(profile.highlight.y / MAP_HEIGHT) * 100}%`,
            width: `${(profile.highlight.width / MAP_WIDTH) * 100}%`,
            height: `${(profile.highlight.height / MAP_HEIGHT) * 100}%`,
            opacity: i === activeIndex ? 1 : 0,
          }}
        >
          <Image src={profile.highlight.src} alt="" fill className="pointer-events-none select-none" />
        </div>
      ))}

      {MAP_PROFILES.map((profile, i) => {
        const badgeLeft = ((profile.highlight.x + profile.highlight.width / 2) / MAP_WIDTH) * 100;
        const badgeTop = (profile.highlight.y / MAP_HEIGHT) * 100;
        return (
          <div
            key={`badge-${profile.name}`}
            className="absolute w-[125px] -translate-x-1/2 -translate-y-full transition-opacity duration-700 ease-in-out"
            style={{
              left: `${badgeLeft}%`,
              top: `${badgeTop}%`,
              opacity: i === activeIndex ? 1 : 0,
              pointerEvents: i === activeIndex ? 'auto' : 'none',
            }}
          >
            <div className="w-[125px] overflow-hidden rounded-md bg-white shadow-[0px_13px_10.4px_rgba(0,0,0,0.16)]">
              <Image
                src={profile.image}
                alt={`${profile.name}, ${profile.country}`}
                width={125}
                height={127}
                className="h-auto w-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
