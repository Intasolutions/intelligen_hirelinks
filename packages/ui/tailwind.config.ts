import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        admin: {
          bg: "#1D1D1D",
          card: "#262626", // slightly lighter than bg for cards
          accent: "#2A9D8F",
          hover: "#248276",
        }
      },
    },
  },
  plugins: [],
};
export default config;
