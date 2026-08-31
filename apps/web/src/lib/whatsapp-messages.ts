// Maps route patterns to a predefined WhatsApp message. Matched against
// `usePathname()` from most specific to least specific (array order matters);
// falls through to DEFAULT_MESSAGE when nothing matches.
const PAGE_MESSAGES: { test: (path: string) => boolean; message: string }[] = [
  { test: (p) => p === '/', message: "Hi! I found your website and I'd like to know more about Intelligen Hirelinks." },
  { test: (p) => p.startsWith('/about'), message: 'Hi! I was reading about Intelligen Hirelinks and had a few questions.' },
  { test: (p) => p.startsWith('/services'), message: "Hi! I'm interested in your services and would like to know more." },
  { test: (p) => p.startsWith('/programs'), message: "Hi! I'm interested in your programs and would like more details." },
  { test: (p) => p.startsWith('/blog'), message: 'Hi! I was reading your blog and wanted to get in touch.' },
  { test: (p) => p.startsWith('/contact'), message: "Hi! I'd like to get in touch with your team." },
];

const DEFAULT_MESSAGE = 'Hi! I have a question about Intelligen Hirelinks.';

export function getMessageForPath(pathname: string): string {
  return PAGE_MESSAGES.find(({ test }) => test(pathname))?.message ?? DEFAULT_MESSAGE;
}

/** Builds a wa.me link, stripping everything but digits from the number. */
export function buildWhatsAppLink(rawNumber: string, message: string): string {
  const digits = rawNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
