import sanitizeHtml from 'sanitize-html';

// isomorphic-dompurify (used elsewhere for this same admin-authored-HTML
// sanitizing job) pulls in jsdom, which now transitively requires an
// ESM-only package (@exodus/bytes, via html-encoding-sniffer) that Next's
// serverless functions can't require() at runtime — it throws
// ERR_REQUIRE_ESM and 500s the page. sanitize-html does the same job as a
// pure string transform with no DOM emulation, so it has no such
// dependency and works reliably in Vercel's Node runtime. Scoped to just
// the privacy-policy/terms-and-conditions pages that hit this crash;
// tags/attributes mirror what TiptapEditor.tsx's StarterKit + Link +
// Underline + TextAlign extensions actually produce.
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
