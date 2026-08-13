'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';

// Base map frame is 1387x706 in Figma's own coordinate space (node "XMLID_465_").
// Each country highlight below was exported as its own tight-cropped SVG; x/y are
// that shape's position within the base map frame, read from Figma's Design panel.
const MAP_WIDTH = 1387;
const MAP_HEIGHT = 706;

export interface MapProfile {
  name: string;
  country: string;
  flagIcon: string;
  photo: string;
  highlight: { src: string; x: number; y: number; width: number; height: number };
}

// Name, country, photo, and flag are independent fields — edit any one here
// without touching the others or needing a re-export from Figma.
export const MAP_PROFILES: MapProfile[] = [
  {
    name: 'Olivia Williams',
    country: 'India',
    flagIcon: '/images/flags/in.svg',
    photo: '/images/home/profile-photo-india.png',
    highlight: { src: '/images/home/hero-map-india.svg', x: 968.88, y: 235.22, width: 137, height: 153 },
  },
  {
    name: 'Rachel McDermott',
    country: 'Brazil',
    flagIcon: '/images/flags/br.svg',
    photo: '/images/home/profile-photo-brazil.png',
    highlight: { src: '/images/home/hero-map-brazil.svg', x: 283.28, y: 402.73, width: 191, height: 217 },
  },
  {
    name: 'Angelina David',
    country: 'Australia',
    flagIcon: '/images/flags/au.svg',
    photo: '/images/home/profile-photo-australia.png',
    highlight: { src: '/images/home/hero-map-australia.svg', x: 1178.87, y: 492.34, width: 193, height: 156 },
  },
  {
    name: 'Catherine Meg',
    country: 'USA',
    flagIcon: '/images/flags/us.svg',
    photo: '/images/home/profile-photo-usa.png',
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
        const isActive = i === activeIndex;
        return (
          <div
            key={`badge-${profile.name}`}
            className="absolute w-[145px] -translate-x-1/2 -translate-y-full overflow-visible"
            style={{
              left: `${badgeLeft}%`,
              top: `${badgeTop}%`,
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 1 : 0,
            }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 32 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                >
                  <div className="w-[145px] rounded-lg bg-white p-2 shadow-[0px_13px_10.4px_rgba(0,0,0,0.16)]">
                    <div
                      className="relative h-[82px] w-full overflow-hidden rounded-md"
                      style={{ backgroundColor: '#dddddd' }}
                    >
                      <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
                    </div>
                    <div className="px-1 pb-1 pt-2">
                      <p className="truncate text-sm font-semibold text-gray-900">{profile.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="relative size-4 shrink-0 overflow-hidden rounded-full">
                          <Image src={profile.flagIcon} alt="" fill className="object-cover" />
                        </span>
                        {profile.country}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
