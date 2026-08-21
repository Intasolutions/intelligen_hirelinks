'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

const LOREM = 'T Purus In In Fames Sit Ac Vitae. Curabitur Scelerisque Nunc Mauris Blandit. Donec Tristique Placerat Consectetur Molestie Est Ornare. Suspendisse';

// Each card's icon glyph, traced from Figma: a small crisp icon (top-left)
// plus the same shape blown up and faded as a bottom-right watermark.
// Card 1 — teal — solid white burst icon + faint white watermark.
function BurstIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 57 57" fill="none">
      <path d="M29.8222 22.6152L43.5486 4.35818L47.1694 7.0804L33.4429 25.3374L56.058 22.1339L56.6932 26.6184L34.0781 29.8219L52.3351 43.5484L49.6129 47.1691L31.3559 33.4426L34.5595 56.0587L30.075 56.6939L26.8714 34.0779L13.1449 52.3349L9.52519 49.6125L23.2507 31.3557L0.635625 34.5591L0.000380829 30.0746L22.6154 26.8711L4.35955 13.1455L7.08163 9.52382L25.3375 23.2495L22.1342 0.635361L26.6187 0.00011682L29.8222 22.6152Z" fill="white" />
    </svg>
  );
}
function BurstWatermark() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 171 171" fill="none">
      <path d="M89.4668 67.8471L130.646 13.0761L141.506 21.2421L100.328 76.0119L168.174 66.4014L170.08 79.8559L102.235 89.4663L157.004 130.644L148.839 141.506L94.0676 100.327L103.678 168.174L90.2247 170.079L80.614 102.232L39.4347 157.003L28.5738 148.838L69.7531 94.0674L1.90604 103.678L0.000165925 90.2236L67.8463 80.613L13.0753 39.4336L21.242 28.5715L76.013 69.7509L66.4025 1.9057L79.8561 -3.06466e-05L89.4668 67.8471Z" fill="white" fillOpacity="0.16" />
    </svg>
  );
}

// Card 2 — light grey — black-outline flower icon + faint grey/black watermark.
function FlowerIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 63 63" fill="none">
      <circle cx="31.4873" cy="31.4869" r="27.7426" transform="rotate(6.85864 31.4873 31.4869)" fill="#ECECEC" stroke="black" strokeWidth="1.13235" />
      <circle cx="31.4872" cy="31.4867" r="14.1544" transform="rotate(6.85864 31.4872 31.4867)" fill="#ECECEC" stroke="black" strokeWidth="1.13235" />
      <circle cx="30.6762" cy="38.2323" r="20.9485" transform="rotate(6.85864 30.6762 38.2323)" stroke="black" strokeWidth="1.13235" />
      <circle cx="32.2983" cy="24.7416" r="20.9485" transform="rotate(6.85864 32.2983 24.7416)" stroke="black" strokeWidth="1.13235" />
      <circle cx="38.2329" cy="32.2982" r="20.9485" transform="rotate(6.85864 38.2329 32.2982)" stroke="black" strokeWidth="1.13235" />
      <circle cx="24.7416" cy="30.6756" r="20.9485" transform="rotate(6.85864 24.7416 30.6756)" stroke="black" strokeWidth="1.13235" />
    </svg>
  );
}
function FlowerWatermark() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 189 189" fill="none">
      <g opacity="0.1">
        <circle cx="94.461" cy="94.4607" r="83.2279" transform="rotate(6.85864 94.461 94.4607)" fill="#ECECEC" stroke="black" strokeWidth="3.39706" />
        <circle cx="94.4606" cy="94.4606" r="42.4632" transform="rotate(6.85864 94.4606 94.4606)" fill="#ECECEC" stroke="black" strokeWidth="3.39706" />
        <circle cx="92.0267" cy="114.697" r="62.8456" transform="rotate(6.85864 92.0267 114.697)" stroke="black" strokeWidth="3.39706" />
        <circle cx="96.8949" cy="74.2239" r="62.8456" transform="rotate(6.85864 96.8949 74.2239)" stroke="black" strokeWidth="3.39706" />
        <circle cx="114.698" cy="96.8946" r="62.8456" transform="rotate(6.85864 114.698 96.8946)" stroke="black" strokeWidth="3.39706" />
        <circle cx="74.2249" cy="92.0264" r="62.8456" transform="rotate(6.85864 74.2249 92.0264)" stroke="black" strokeWidth="3.39706" />
      </g>
    </svg>
  );
}

// Card 3 — blue — white dash-burst icon + faint white watermark.
function SparkIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 63 63" fill="none">
      <g id="spark-inner">
        <rect x="26.0186" y="3.08278" width="4.52941" height="12.4559" transform="rotate(-5.60042 26.0186 3.08278)" fill="white" />
      </g>
      <use xlinkHref="#spark-inner" transform="translate(31.0353 -12.8551) rotate(45)" />
      <use xlinkHref="#spark-inner" transform="translate(62.0705 0.000235602) rotate(90)" />
      <use xlinkHref="#spark-inner" transform="translate(74.9257 31.0356) rotate(135)" />
      <use xlinkHref="#spark-inner" transform="translate(62.0703 62.0708) rotate(-180)" />
      <use xlinkHref="#spark-inner" transform="translate(31.035 74.9259) rotate(-135)" />
      <use xlinkHref="#spark-inner" transform="translate(-0.000234616 62.0705) rotate(-90)" />
      <use xlinkHref="#spark-inner" transform="translate(-12.8553 31.0352) rotate(-45)" />
    </svg>
  );
}
function SparkWatermark() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 186 186" fill="none">
      <g opacity="0.16">
        <g id="spark-wm-inner">
          <rect x="77.8076" y="9.21832" width="13.545" height="37.2486" transform="rotate(-5.60042 77.8076 9.21832)" fill="white" />
        </g>
        <use xlinkHref="#spark-wm-inner" transform="translate(92.8092 -38.4428) rotate(45)" />
        <use xlinkHref="#spark-wm-inner" transform="translate(185.618 9.83786e-05) rotate(90)" />
        <use xlinkHref="#spark-wm-inner" transform="translate(224.061 92.8092) rotate(135)" />
        <use xlinkHref="#spark-wm-inner" transform="translate(185.618 185.618) rotate(-180)" />
        <use xlinkHref="#spark-wm-inner" transform="translate(92.809 224.061) rotate(-135)" />
        <use xlinkHref="#spark-wm-inner" transform="translate(-9.54286e-05 185.618) rotate(-90)" />
        <use xlinkHref="#spark-wm-inner" transform="translate(-38.4428 92.8091) rotate(-45)" />
      </g>
    </svg>
  );
}

// Card 4 — black — white-outline concentric rings icon + faint watermark.
function RingsIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 63 63" fill="none">
      <circle cx="31.3054" cy="31.3054" r="27.7438" transform="rotate(6.43711 31.3054 31.3054)" fill="#1D1D1D" stroke="white" strokeWidth="1.1324" />
      <circle cx="31.6049" cy="28.6552" r="22.0818" transform="rotate(6.43711 31.6049 28.6552)" fill="#1D1D1D" stroke="white" strokeWidth="1.1324" />
      <circle cx="30.8017" cy="33.6977" r="15.8536" transform="rotate(6.43711 30.8017 33.6977)" fill="#1D1D1D" stroke="white" strokeWidth="1.1324" />
      <circle cx="30.9936" cy="29.0228" r="9.0592" transform="rotate(6.43711 30.9936 29.0228)" fill="#1D1D1D" stroke="white" strokeWidth="1.1324" />
    </svg>
  );
}
function RingsWatermark() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 188 188" fill="none">
      <g opacity="0.16">
        <circle cx="93.9127" cy="93.9124" r="83.2279" transform="rotate(6.43711 93.9127 93.9124)" fill="#1D1D1D" stroke="white" strokeWidth="3.39706" />
        <circle cx="94.8099" cy="85.9624" r="66.2426" transform="rotate(6.43711 94.8099 85.9624)" fill="#1D1D1D" stroke="white" strokeWidth="3.39706" />
        <circle cx="92.4" cy="101.089" r="47.5588" transform="rotate(6.43711 92.4 101.089)" fill="#1D1D1D" stroke="white" strokeWidth="3.39706" />
        <circle cx="92.9762" cy="87.0652" r="27.1765" transform="rotate(6.43711 92.9762 87.0652)" fill="#1D1D1D" stroke="white" strokeWidth="3.39706" />
      </g>
    </svg>
  );
}

interface ProgramCard {
  title: string;
  bg: string;
  textColor: string;
  Icon: () => JSX.Element;
  Watermark: () => JSX.Element;
  /** Hover-state "View More!" pill colors — contrast against the card bg. */
  pillBg: string;
  pillText: string;
  /** Resting stacked-pile pose (all cards centered, alternating tilt). */
  stackRotate: number;
  stackY: number;
  /** Fanned-out (scrolled-into-view) pose, traced from Figma (card 313.66x336.31):
   *  fanXPct/fanYPct are offsets as % of card width/height from the fan's center. */
  fanRotate: number;
  fanXPct: number;
  fanYPct: number;
}

// Traced from Figma fanned-out layout (each card 313.66x336.31):
//  card1 x=68.97  y=291.01 rot=8.06deg
//  card2 x=398.16 y=344.82 rot=-6.86deg
//  card3 x=718.90 y=312.84 rot=5.6deg
//  card4 x=1020.48 y=269.82 rot=-6.44deg
const PROGRAMS: ProgramCard[] = [
  { title: 'International Nurse Pre-Enrolment Program', bg: '#2a9d8f', textColor: '#ffffff', Icon: BurstIcon, Watermark: BurstWatermark, pillBg: '#ffffff', pillText: '#2a9d8f', stackRotate: -8, stackY: 6, fanRotate: 8.06, fanXPct: -153.88, fanYPct: -4.05 },
  { title: 'International Placement Program', bg: '#e9e9ea', textColor: '#111111', Icon: FlowerIcon, Watermark: FlowerWatermark, pillBg: '#161616', pillText: '#ffffff', stackRotate: 4, stackY: 3, fanRotate: -6.86, fanXPct: -48.93, fanYPct: 11.95 },
  { title: 'International Student Counselling Program', bg: '#0c78b8', textColor: '#ffffff', Icon: SparkIcon, Watermark: SparkWatermark, pillBg: '#ffffff', pillText: '#0c78b8', stackRotate: -3, stackY: 2, fanRotate: 5.6, fanXPct: 53.33, fanYPct: 2.44 },
  { title: 'International Student Counselling Program', bg: '#161616', textColor: '#ffffff', Icon: RingsIcon, Watermark: RingsWatermark, pillBg: '#ffffff', pillText: '#161616', stackRotate: 2, stackY: 0, fanRotate: -6.44, fanXPct: 149.48, fanYPct: -10.35 },
];

function ProgramCardEl({ program, index }: { program: ProgramCard; index: number }) {
  const { Icon, Watermark } = program;
  return (
    <motion.div
      className="group absolute left-1/2 top-0 aspect-[313.66/336.31] w-[42%] overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.18)] lg:w-[23%]"
      style={{ backgroundColor: program.bg, zIndex: index }}
      initial={{
        rotate: program.stackRotate,
        x: '-50%',
        y: `${program.stackY}px`,
      }}
      whileInView={{
        rotate: program.fanRotate,
        x: `calc(-50% + ${program.fanXPct}%)`,
        y: `${program.fanYPct}%`,
      }}
      viewport={{ once: false, amount: 0.4, margin: '0px 0px -100px 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: index * 0.12 }}
    >
      {/* Faint watermark, anchored to the bottom-right corner but kept fully inside the card.
          Rotates 180deg on hover, reverses back to rest on hover-out. */}
      <div
        className="pointer-events-none absolute transition-transform duration-[400ms] ease-out group-hover:rotate-180"
        style={{ right: '0%', bottom: '0%', width: '47%', aspectRatio: '1 / 1' }}
      >
        <Watermark />
      </div>

      {/* Icon — traced from Figma (9.79%/17.59%), nudged closer to the card edge. */}
      <div
        className="absolute"
        style={{ left: '6%', top: '8%', width: '18.05%', aspectRatio: '1 / 1' }}
      >
        <Icon />
      </div>

      {/* "View More!" pill — positioned as a % of card height so it scales
          smoothly at every viewport width, not just at fixed breakpoints.
          Fades/slides in on hover without moving anything else. */}
      <div
        className="pointer-events-none absolute left-6 z-10 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        style={{ bottom: '52%' }}
      >
        <span className="pointer-events-auto inline-block">
          <PillButton href="#programs" bgColor={program.pillBg} textColor={program.pillText}>
            View More!
          </PillButton>
        </span>
      </div>

      {/* Heading fills the fixed bottom region below the pill. */}
      <p
        className="absolute bottom-6 left-6 right-6 font-sans text-base font-medium lg:text-[27.18px]"
        style={{
          color: program.textColor,
          lineHeight: '120%',
          letterSpacing: '0%',
        }}
      >
        {program.title}
      </p>
    </motion.div>
  );
}

// Mobile-only card: a plain full-width vertical card (no fan/stack, no
// hover-reveal pill since there's no hover on touch) — the horizontal fan
// concept doesn't translate to a narrow screen, so phones get their own
// straightforward layout instead of a squeezed-down desktop composition.
function ProgramCardMobile({ program, index }: { program: ProgramCard; index: number }) {
  const { Icon, Watermark } = program;
  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl p-5 shadow-[0_16px_32px_rgba(0,0,0,0.14)]"
      style={{ backgroundColor: program.bg }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 100, damping: 18, delay: index * 0.08 }}
    >
      <div className="pointer-events-none absolute" style={{ right: '0%', bottom: '0%', width: '34%', aspectRatio: '1 / 1' }}>
        <Watermark />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-9 w-9">
          <Icon />
        </div>
        <PillButton href="#programs" bgColor={program.pillBg} textColor={program.pillText}>
          View More!
        </PillButton>
      </div>

      <p
        className="relative mt-6 font-sans text-lg font-medium"
        style={{ color: program.textColor, lineHeight: '120%', letterSpacing: '0%' }}
      >
        {program.title}
      </p>
    </motion.div>
  );
}

export function ProgramsSection() {
  return (
    <section className="relative w-full overflow-x-hidden bg-white px-4 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-start gap-2">
          <div className="relative mt-1.5 h-[18px] w-[20px] shrink-0 lg:mt-2.5 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-2xl font-bold leading-tight text-black sm:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            <span className="text-black">Our Featured</span> <span className="text-[#2a9d8f]">Programs</span>
          </p>
        </FadeInWhenVisible>

        <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
          <FadeInWhenVisible delay={0.1} className="max-w-2xl text-sm leading-relaxed text-black lg:text-lg">
            {LOREM}
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.15} className="shrink-0">
            <PillButton href="#programs" variant="solid">
              View More!
            </PillButton>
          </FadeInWhenVisible>
        </div>

        {/* Mobile: plain vertical stack of full-width cards, each fading/sliding
            up into view as it's scrolled to — its own simple layout instead of
            a squeezed-down version of the desktop fan effect. */}
        <div className="mt-10 flex flex-col gap-5 sm:hidden">
          {PROGRAMS.map((program, i) => (
            <ProgramCardMobile key={i} program={program} index={i} />
          ))}
        </div>

        {/* Tablet/desktop: each card is absolutely centered and animates
            between a resting "stacked pile" pose and a fanned-out, staggered-
            height spread as it scrolls in/out of view. */}
        <div className="relative mt-16 hidden sm:block sm:h-[400px] lg:mt-20 lg:h-[420px]">
          {PROGRAMS.map((program, i) => (
            <ProgramCardEl key={i} program={program} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
