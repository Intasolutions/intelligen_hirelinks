import type { Config } from "tailwindcss";
import sharedConfig from "@hirelinks/ui/tailwind.config";

const config: Pick<Config, "content" | "presets" | "theme"> = {
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
      },
    },
  },
};

export default config;
