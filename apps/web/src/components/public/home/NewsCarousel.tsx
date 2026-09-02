'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FadeInWhenVisible } from '../FadeInWhenVisible';
import { PillButton } from '../PillButton';

export interface NewsPost {
  _id: string;
  title: string;
  slug: string;
  image?: { url: string; publicId: string };
  coverImageAlt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}

const AUTOPLAY_INTERVAL_MS = 6000;
// Fixed site byline — posts don't carry a per-author name today (the user
// model has no display-name field), so every card shares one, matching the
// reference's "Name | Date" meta line without inventing per-post identities.
const BYLINE = 'Updates';

// Every card — active or peeking — renders at this one width per breakpoint:
// generous on phones (where a 50/50 split would leave too little room for
// the headline/pill), narrowing toward exactly half the viewport at desktop
// so one full card centres with exactly half of each neighbour showing.
const CARD_WIDTH_CLASS = 'w-[84vw] sm:w-[70vw] lg:w-[50vw]';
const CARD_SIZES = '(max-width: 640px) 84vw, (max-width: 1024px) 70vw, 50vw';

// Hand-tweened easeOutCubic — deliberately not native `scrollTo(behavior:
// 'smooth')`, whose duration/curve varies by distance and browser and never
// quite reads as a designed "slide". Duration scales with distance (capped)
// so a far-away dot click still reads as one continuous glide across every
// card in between, rather than covering more ground in the same fixed time.
const SLIDE_BASE_MS = 480;
const SLIDE_PER_CARD_MS = 110;
const SLIDE_MAX_MS = 1000;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function NewsCard({
  post,
  isActive,
  onActivate,
  registerRef,
  isLast,
}: {
  post: NewsPost;
  isActive: boolean;
  onActivate: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
  isLast: boolean;
}) {
  const dateLabel = formatDate(post.publishedAt || post.createdAt);

  const photo = (
    <div className="relative aspect-[2.19/1] w-full overflow-hidden rounded-2xl bg-[#ececec]">
      {post.image?.url && (
        <Image src={post.image.url} alt={post.coverImageAlt || post.title} fill sizes={CARD_SIZES} className="object-cover" />
      )}
      {/* Peek cards read as inactive glass — a heavy white wash over the
          photo, tuned to the reference's near-white sliver (measured ~90%
          white over the source image). Transitions with `isActive` so the
          card entering the centre visibly "wakes up" rather than snapping. */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-white transition-opacity duration-500 ${isActive ? 'opacity-0' : 'opacity-[0.88]'}`}
      />
    </div>
  );

  const textBlock = (
    <>
      <div className="mt-4 flex items-center justify-between gap-3 sm:mt-6 sm:gap-4">
        <h3 className="line-clamp-2 flex-1 font-sans text-base font-bold leading-snug text-black sm:text-lg lg:text-2xl">
          {post.title}
        </h3>
        {isActive ? (
          <>
            {/* Full pill from sm up; below that the label would crowd out the
                headline on a narrow card, so only the arrow badge shows. */}
            <span className="hidden shrink-0 sm:inline-flex">
              <PillButton href={`/blog/${post.slug}`} bgColor="#000000" textColor="#ffffff">
                Read More
              </PillButton>
            </span>
            <span className="shrink-0 sm:hidden">
              <PillButton href={`/blog/${post.slug}`} bgColor="#000000" textColor="#ffffff" iconOnly aria-label={`Read: ${post.title}`} />
            </span>
          </>
        ) : (
          // Same shape as the real button, at the same measured near-invisible
          // grey-on-grey — but non-interactive (no Link/anchor), since this
          // whole card is already a <button> onClick={onActivate} and a nested
          // interactive element would be invalid there.
          <span aria-hidden className="shrink-0">
            <span className="hidden sm:inline-flex">
              <PillButton href="#" interactive={false} bgColor="#e5e5e5" textColor="#e5e5e5">
                Read More
              </PillButton>
            </span>
            <span className="sm:hidden">
              <PillButton href="#" interactive={false} iconOnly bgColor="#e5e5e5" textColor="#e5e5e5" />
            </span>
          </span>
        )}
      </div>
      <p className="mt-2 font-sans text-sm text-[#acacac] sm:mt-3 sm:text-base lg:mt-4 lg:text-lg">
        <span className={isActive ? 'text-[#acacac]' : 'text-[#e5e5e5]'}>{BYLINE}</span>
        <span className={`mx-2 ${isActive ? 'text-[#acacac]' : 'text-[#e5e5e5]'}`}>|</span>
        <span className={isActive ? 'text-[#acacac]' : 'text-[#e5e5e5]'}>{dateLabel}</span>
      </p>
    </>
  );

  return (
    <div
      ref={registerRef}
      className={`shrink-0 snap-center border-[#d0d0d0] pb-8 ${CARD_WIDTH_CLASS} ${isLast ? '' : 'border-r'}`}
    >
      {/* Small internal inset so the photo/text sit just off the divider
          line rather than touching it — separate from the divider itself,
          which sits flush at the true card boundary with no extra gap. */}
      {isActive ? (
        <div className="px-3">
          {photo}
          {textBlock}
        </div>
      ) : (
        <button type="button" onClick={onActivate} aria-label={`View story: ${post.title}`} className="block w-full px-3 text-left">
          {photo}
          {textBlock}
        </button>
      )}
    </div>
  );
}

export function NewsCarousel({ posts }: { posts: NewsPost[] }) {
  const hasLoop = posts.length > 1;
  // Extended render list: a clone of the last post prepended and a clone of
  // the first appended, so every real post — including the first and last —
  // has a neighbour to peek at on both sides. `extIndex` indexes into this
  // list; real posts live at [1, posts.length], clones sit at 0 and length+1.
  const extended = hasLoop ? [posts[posts.length - 1], ...posts, posts[0]] : posts;
  const [extIndex, setExtIndex] = useState(hasLoop ? 1 : 0);
  const extIndexRef = useRef(extIndex);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrame = useRef<number | null>(null);
  // True only while `centerCard`'s own tween is actively writing scrollLeft.
  // Gates the live "which card is closest" tracking below, which otherwise
  // fires on every scroll event our own animation generates — flipping the
  // active card through every intermediate one mid-slide instead of staying
  // put until the glide actually finishes.
  const isAnimating = useRef(false);

  useEffect(() => {
    extIndexRef.current = extIndex;
  }, [extIndex]);

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  // Scrolls only the track itself — never `Element.scrollIntoView`, which
  // walks every scrollable ancestor including the page, so it would yank the
  // whole window down to this section on every autoplay tick no matter where
  // the visitor currently is on the homepage.
  //
  // 'smooth' hand-tweens `scrollLeft` with a distance-scaled duration and a
  // fixed curve (see the SLIDE_* constants/easeOutCubic above) rather than
  // native `scrollTo(behavior:'smooth')`, whose timing varies by distance and
  // browser and exposes no control at all. 'auto' is a plain, instant
  // assignment — used for the loop's invisible clone-to-real swaps, which
  // must never be seen animating.
  const centerCard = (ext: number, behavior: ScrollBehavior) => {
    const track = trackRef.current;
    const el = cardRefs.current[ext];
    if (!track || !el) return;
    const target = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;

    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    if (behavior === 'auto') {
      track.scrollLeft = target;
      isAnimating.current = false;
      return;
    }
    const from = track.scrollLeft;
    const cardsTraversed = Math.max(1, Math.round(Math.abs(target - from) / el.offsetWidth));
    const duration = Math.min(SLIDE_MAX_MS, SLIDE_BASE_MS + (cardsTraversed - 1) * SLIDE_PER_CARD_MS);
    const start = performance.now();
    isAnimating.current = true;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      track.scrollLeft = from + (target - from) * easeOutCubic(t);
      if (t < 1) {
        animationFrame.current = requestAnimationFrame(step);
      } else {
        animationFrame.current = null;
        isAnimating.current = false;
      }
    };
    animationFrame.current = requestAnimationFrame(step);
  };

  const scrollToExt = (ext: number, behavior: ScrollBehavior = 'smooth') => {
    centerCard(ext, behavior);
    setExtIndex(ext);
  };

  // Native scroll defaults to the leading clone (ext=0) being in view at
  // mount, so this instantly re-centres on the real first card before first
  // paint. Also keeps the active card correctly centred if the viewport is
  // resized (e.g. orientation change) — card width is a CSS breakpoint value,
  // not a JS constant, so `centerCard` re-measures it live each time.
  useLayoutEffect(() => {
    if (!hasLoop) return;
    centerCard(1, 'auto');
    const onResize = () => centerCard(extIndexRef.current, 'auto');
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dots / peek-card clicks think in real post-index terms (0..length-1);
  // this is the only place that maps a real index to where it lives in the
  // extended list.
  const goTo = (realTarget: number) => {
    const wrapped = ((realTarget % posts.length) + posts.length) % posts.length;
    scrollToExt(hasLoop ? wrapped + 1 : wrapped);
  };

  // Autoplay always steps the extended index forward by exactly one — even
  // onto a trailing clone — so the motion is always a forward continuation,
  // never a reverse sweep back to the start. The scroll-settle effect below
  // silently resolves landing on a clone back to the real card it mirrors.
  useEffect(() => {
    if (!hasLoop) return;
    const id = setInterval(() => scrollToExt(extIndex + 1), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasLoop, extIndex]);

  // Keeps `extIndex` live during any scroll (drag or programmatic), and once
  // scrolling settles, silently (instantly, no animation) swaps a landing on
  // either end clone for the equivalent real card — invisible to the viewer
  // since the clone is pixel-identical to what it mirrors.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !hasLoop) return;
    let raf = 0;
    let settleTimer: number;

    const updateClosest = () => {
      if (isAnimating.current) return;
      let closest = 0;
      let closestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - (track.scrollLeft + track.clientWidth / 2));
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setExtIndex((current) => (current === closest ? current : closest));
    };

    const resolveSettle = () => {
      setExtIndex((current) => {
        if (current === 0) {
          centerCard(posts.length, 'auto');
          return posts.length;
        }
        if (current === extended.length - 1) {
          centerCard(1, 'auto');
          return 1;
        }
        return current;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateClosest);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(resolveSettle, 150);
    };

    // If the visitor grabs the track mid-glide, stop fighting their touch —
    // our own tween would otherwise keep overwriting scrollLeft every frame
    // against their drag.
    const onPointerDown = () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      isAnimating.current = false;
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
    };
  }, [hasLoop, posts.length, extended.length]);

  if (posts.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-12 lg:py-24">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <FadeInWhenVisible className="flex items-start gap-2">
          <div className="relative mt-1 h-4 w-[18px] shrink-0 sm:mt-1.5 sm:h-[18px] sm:w-[20px] lg:mt-2.5 lg:h-[30px] lg:w-[34px]">
            <Image src="/images/home/stats-slash-icon.svg" alt="" fill className="object-contain" />
          </div>
          <p className="font-display-rounded text-xl font-bold leading-tight text-black sm:text-2xl md:text-3xl lg:whitespace-nowrap lg:text-[42px]">
            <span className="text-black">Latest</span> <span className="text-[#2a9d8f]">Updates</span>
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1} className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-black sm:mt-6 lg:mt-8 lg:text-lg">
          Stay informed with the latest opportunities, nursing programmes, placement updates, recruitment news, and important announcements from Intelligen Hirelinks. Discover new pathways and career opportunities for nurses.
        </FadeInWhenVisible>
      </div>

      {/* Full-bleed track — deliberately breaks out of the max-w wrapper
          above so the neighbouring cards can peek in from the true viewport
          edge, matching the reference. No extra padding needed: every card —
          peek or active — shares the same CARD_WIDTH_CLASS at any given
          breakpoint, so centering any one of them via `centerCard` (which
          measures the live rendered width, not a fixed constant) naturally
          leaves the rest of its neighbour showing on each side — including at
          the very first/last real post, since the loop clones (above) supply
          a same-size neighbour to peek at there too. */}
      <FadeInWhenVisible delay={0.15} className="relative mt-10 sm:mt-12 lg:mt-14">
        <div ref={trackRef} className="news-track flex snap-x snap-mandatory overflow-x-auto">
          {extended.map((post, ext) => (
            <NewsCard
              key={hasLoop && (ext === 0 || ext === extended.length - 1) ? `clone-${ext}` : post._id}
              post={post}
              isActive={ext === extIndex}
              isLast={ext === extended.length - 1}
              onActivate={() => goTo(hasLoop ? ext - 1 : ext)}
              registerRef={(el) => { cardRefs.current[ext] = el; }}
            />
          ))}
        </div>

        {posts.length > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:mt-8">
            {posts.map((_, i) => {
              const active = hasLoop ? extIndex === i + 1 : extIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to story ${i + 1}`}
                  className="rounded-md transition-all"
                  style={{ height: active ? 14 : 8, width: active ? 14 : 8, backgroundColor: active ? '#2a9d8f' : '#b9b9b9' }}
                />
              );
            })}
          </div>
        )}
      </FadeInWhenVisible>

      <style jsx>{`
        .news-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .news-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
