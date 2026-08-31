'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const WhatsAppMessageContext = createContext<{
  override: string | null;
  setOverride: (message: string | null) => void;
} | null>(null);

export function WhatsAppMessageProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<string | null>(null);
  return (
    <WhatsAppMessageContext.Provider value={{ override, setOverride }}>
      {children}
    </WhatsAppMessageContext.Provider>
  );
}

function useWhatsAppMessageContext() {
  const ctx = useContext(WhatsAppMessageContext);
  if (!ctx) throw new Error('useWhatsAppMessageContext must be used within WhatsAppMessageProvider');
  return ctx;
}

export function useWhatsAppOverride() {
  return useWhatsAppMessageContext().override;
}

/**
 * Lets a page (e.g. a service/program/blog detail page) set a specific
 * WhatsApp message — e.g. naming the item the visitor is viewing — instead
 * of the generic per-section default. Mount once near the top of the page;
 * clears itself on unmount so navigating away restores the default.
 */
export function SetWhatsAppMessage({ message }: { message: string }) {
  const { setOverride } = useWhatsAppMessageContext();

  useEffect(() => {
    setOverride(message);
    return () => setOverride(null);
  }, [message, setOverride]);

  return null;
}
