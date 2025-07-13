import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // tailwind.config.ts

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        saysettha: ["Saysettha OT", "sans-serif"],
        phetsarath: ["Phetsarath_OT", "Times New Roman", "serif"],
        times: ["Times New Roman", "serif"],
      },
    },
  },


  plugins: [],
} satisfies Config;
