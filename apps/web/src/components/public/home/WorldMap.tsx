'use client';

import Image from 'next/image';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = '/data/countries-110m.json';

export interface MapProfile {
  name: string;
  country: string;
  countryName: string; // must match the "name" property in countries-110m.json
  coordinates: [number, number]; // [lon, lat]
  image: string;
}

export const MAP_PROFILES: MapProfile[] = [
  { name: 'Olivia Williams', country: 'India', countryName: 'India', coordinates: [82, 22], image: '/images/home/badge_4_India.png' },
  { name: 'Rachel McDermott', country: 'Brazil', countryName: 'Brazil', coordinates: [-52, -12], image: '/images/home/badge_3_Brazil.png' },
  { name: 'Angelina David', country: 'Australia', countryName: 'Australia', coordinates: [134, -25], image: '/images/home/badge_2_australia.png' },
  { name: 'Catherine Meg', country: 'USA', countryName: 'United States of America', coordinates: [-97, 38], image: '/images/home/badge_1_USA.png' },
];

const BADGE_WIDTH = 125;

interface WorldMapProps {
  activeIndex: number;
}

export function WorldMap({ activeIndex }: WorldMapProps) {
  const active = MAP_PROFILES[activeIndex];

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 130, center: [10, 20] }}
      width={1440}
      height={700}
      className="h-full w-full overflow-visible"
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isActive = geo.properties.name === active.countryName;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isActive ? '#2a9d8f' : '#e5e7eb'}
                stroke="#ffffff"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none', transition: 'fill 0.6s ease' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>

      {MAP_PROFILES.map((profile, i) => (
        <Marker key={profile.name} coordinates={profile.coordinates}>
          <foreignObject
            x={-BADGE_WIDTH / 2}
            y={-140}
            width={BADGE_WIDTH}
            height={140}
            style={{
              opacity: i === activeIndex ? 1 : 0,
              transition: 'opacity 0.6s ease',
              pointerEvents: 'none',
            }}
          >
            <div className="w-[125px] overflow-hidden rounded-md bg-white shadow-[0px_13px_10.4px_rgba(0,0,0,0.16)]">
              <Image src={profile.image} alt={`${profile.name}, ${profile.country}`} width={125} height={127} className="h-auto w-full" />
            </div>
          </foreignObject>
        </Marker>
      ))}
    </ComposableMap>
  );
}
