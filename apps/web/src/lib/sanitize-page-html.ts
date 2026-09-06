import sanitizeHtml from 'sanitize-html';

// isomorphic-dompurify pulls in jsdom, which transitively requires an
// ESM-only package (@exodus/bytes, via html-encoding-sniffer) that Next's
// Vercel serverless functions can't require() at runtime — it throws
// ERR_REQUIRE_ESM and 500s the page (confirmed on privacy-policy/terms and,
// separately, blog/[slug] once that page got real traffic — same root
// cause, both now on this helper instead). sanitize-html does the same job
// as a pure string transform with no DOM emulation, so it has no such
// dependency and works reliably in Vercel's Node runtime. Tags/attributes
// mirror what TiptapEditor.tsx's StarterKit + Link + Underline + TextAlign
// extensions actually produce — used by every admin-authored rich-text
// field rendered on the public site (pages, blogs).
export function sanitizePageHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'h1', 'h2', 'h3', 'strong', 'em', 'u', 's', 'code',
      'ul', 'ol', 'li', 'blockquote', 'a', 'br',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      '*': ['style'],
    },
    allowedStyles: {
      '*': {
        'text-align': [/^left$|^center$|^right$|^justify$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
