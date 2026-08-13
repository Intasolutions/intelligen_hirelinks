'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface PageReadyContextValue {
  /** Call once when a tracked piece of UI (e.g. a ScaledStage) has its first real measurement. */
  registerReady: (id: string) => void;
  isPageReady: boolean;
}

const PageReadyContext = createContext<PageReadyContextValue | null>(null);

/**
 * Tracks readiness across multiple independent async-measured pieces of UI
 * (each ScaledStage measures itself on mount) plus web font loading, so a
 * single LoadingScreen can wait for all of them before revealing the page —
 * instead of each piece popping in/settling separately.
 */
export function PageReadyProvider({
  children,
  expectedCount,
}: {
  children: ReactNode;
  /** How many distinct UI pieces must call registerReady before the page counts as ready. */
  expectedCount: number;
}) {
  const readyIds = useRef(new Set<string>());
  const [isPageReady, setIsPageReady] = useState(false);

  const registerReady = useCallback(
    (id: string) => {
      readyIds.current.add(id);
      if (readyIds.current.size >= expectedCount) {
        setIsPageReady(true);
      }
    },
    [expectedCount]
  );

  return (
    <PageReadyContext.Provider value={{ registerReady, isPageReady }}>
      {children}
    </PageReadyContext.Provider>
  );
}

export function usePageReady() {
  const ctx = useContext(PageReadyContext);
  return ctx;
}
