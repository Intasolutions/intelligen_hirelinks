'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FadeInWhenVisible } from './FadeInWhenVisible';

export interface FaqItem {
  question: string;
  answer: string;
}

function PlusMinusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-9 sm:w-9 ${
        isOpen ? 'border-[#2a9d8f] bg-white text-[#2a9d8f]' : 'border-transparent bg-[#2a9d8f] text-white'
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d={isOpen ? 'M2.5 8h11' : 'M8 2.5v11M2.5 8h11'} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      </svg>
    </span>
  );
}

function FaqRow({
  item,
  isOpen,
  onToggle,
  // Every card is the same fixed (reduced) width, alternating which edge
  // it's anchored to: even-indexed items sit flush left (mr-auto pushes the
  // leftover width to the right), odd-indexed items sit flush right
  // (ml-auto pushes it to the left) — never a full-width card.
  alignRight,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  alignRight: boolean;
}) {
  return (
    <div className={`w-[92%] sm:w-[94%] lg:w-[calc(100%-4rem)] ${alignRight ? 'ml-auto' : 'mr-auto'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full rounded-2xl px-4 py-3 text-left transition-colors sm:px-8 sm:py-6 ${
          isOpen ? 'bg-[#f6f6f6]' : 'bg-[#f6f6f6]/60 hover:bg-[#f6f6f6]'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className={`font-sans text-sm font-semibold sm:text-base ${isOpen ? 'text-[#2a9d8f]' : 'text-black'}`}>
            {item.question}
          </p>
          <PlusMinusIcon isOpen={isOpen} />
        </div>
        <div
          className={`grid transition-all duration-300 ease-out ${isOpen ? 'mt-3 grid-rows-[1fr] opacity-100 sm:mt-4' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <p className="overflow-hidden font-sans text-sm leading-relaxed text-[#8a8a8a]">{item.answer}</p>
        </div>
      </button>
    </div>
  );
}

export interface FaqAccordionProps {
  /** e.g. "Answers to Most Common Questions" — the last word(s) after the
   * final space are rendered in teal; pass headingAccent to control the
   * split explicitly instead of relying on the last-space heuristic. */
  heading: string;
  /** Portion of `heading` to render in teal (`#2a9d8f`) instead of black.
   * Must be a trailing substring of `heading`. Defaults to the last word. */
  headingAccent?: string;
  items: FaqItem[];
  /** Index to open by default. -1 for all collapsed. Defaults to 0 (first item open). */
  defaultOpenIndex?: number;
  className?: string;
}

/**
 * Shared FAQ/accordion block — pass any question/answer array and it renders
 * exactly that many rows, alternating left/right alignment per the design.
 * Used across multiple pages, not just About.
 */
export function FaqAccordion({ heading, headingAccent, items, defaultOpenIndex = 0, className = '' }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const accent = headingAccent ?? heading.slice(heading.lastIndexOf(' ') + 1);
  const lead = accent && heading.endsWith(accent) ? heading.slice(0, heading.length - accent.length).trimEnd() : heading;

  if (items.length === 0) return null;

  return (
    <section className={`w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-[1360px]">
        <FadeInWhenVisible className="flex items-center justify-center gap-2 text-center">
          <div className="relative h-[18px] w-5 shrink-0 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-xl font-bold leading-tight text-black sm:text-2xl md:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            {lead && <span className="text-black">{lead} </span>}
            <span className="text-[#2a9d8f]">{accent}</span>
          </p>
        </FadeInWhenVisible>

        <div className="mt-8 flex flex-col gap-2.5 sm:mt-12 sm:gap-5">
          {items.map((item, i) => (
            <FadeInWhenVisible key={i} delay={i * 0.05}>
              <FaqRow item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} alignRight={i % 2 === 1} />
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
}
