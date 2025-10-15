// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
 
  content: [
  "./app/**/*.{ts,tsx,js,jsx,md,mdx}",
  "./pages/**/*.{ts,tsx,js,jsx,md,mdx}",
  "./components/**/*.{ts,tsx,js,jsx,md,mdx}",
  "./content/**/*.{md,mdx}",
  "./lib/**/*.{ts,tsx,js,jsx}",
  "./app/admin/**/*.{ts,tsx,js,jsx}",
],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
