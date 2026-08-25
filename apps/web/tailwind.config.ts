import type { Config } from "tailwindcss";
import sharedConfig from "@hirelinks/ui/tailwind.config";
import typography from "@tailwindcss/typography";

const config: Pick<Config, "content" | "presets" | "theme" | "plugins"> = {
  content: [
    "./src/app/**/*.tsx",
    "./src/features/**/*.tsx",
    "./src/components/**/*.tsx",
    "../../packages/ui/src/**/*.tsx",
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-helvetica-neue)", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-fh-lecturis)", "var(--font-helvetica-neue)", "sans-serif"],
        "display-rounded": ["var(--font-fh-lecturis-rounded)", "var(--font-helvetica-neue)", "sans-serif"],
        "league-gothic": ["var(--font-league-gothic)", "sans-serif"],
      },
    },
  },
  // Powers the `prose`/`prose-*` classes used to render admin-authored rich
  // text (blog posts, privacy policy, terms) — was never installed, so
  // every prose-* class across the app was silently generating zero CSS.
  // Formatting saved correctly in the database (bold/blockquote/underline/
  // alignment all persisted fine); it just had nothing to render it with.
  plugins: [typography],
};

export default config;
