'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePageReady } from './PageReadyContext';

const MIN_VISIBLE_MS = 500;
const FADE_MS = 400;

export function LoadingScreen() {
  const pageReady = usePageReady();
  const [fontsReady, setFontsReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const isReady = fontsReady && minTimeElapsed && (pageReady?.isPageReady ?? true);

  useEffect(() => {
    if (!isReady || visible === false) return;
    setVisible(false);
    const timer = setTimeout(() => setHidden(true), FADE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  if (hidden) return null;

  return (
    <div
      aria-hidden={!visible}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="relative h-16 w-20 animate-pulse">
        <Image src="/images/home/hirelinks-logo.png" alt="Hirelinks" fill className="object-contain" priority />
      </div>
    </div>
  );
}
