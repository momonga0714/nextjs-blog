import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { accent: "#00C29E" },
      fontFamily: { sans: ["Noto Sans JP", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
