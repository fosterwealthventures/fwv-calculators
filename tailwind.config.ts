// tailwind.config.ts
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,js,jsx,md,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,md,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,md,mdx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
    "./app/admin/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      /* ===== Palettes ===== */
      colors: {
        // Your existing emerald brand (kept)
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },

        // Professional neutrals (kept)
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },

        // A) Nocturne Gold (deep navy + gold)
        noct: {
          50: "#f2f6fb",
          100: "#dde7f6",
          200: "#b9cbed",
          300: "#8ca9e1",
          400: "#587ed0",
          500: "#3559b6",
          600: "#264391",
          700: "#1f376f",
          800: "#17294f",
          900: "#121f3a",
        },
        aure: {
          50: "#fff9e6",
          100: "#ffefbf",
          200: "#ffe28c",
          300: "#ffd24d",
          400: "#ffc21a",
          500: "#f5b000",
          600: "#d99900",
          700: "#b37d00",
          800: "#8c6200",
          900: "#664700",
        },

        // B) Carbon Mint (charcoal + mint)
        carbon: {
          50: "#f5f7f8",
          100: "#e9edf0",
          200: "#cfd6dc",
          300: "#a7b4be",
          400: "#798b98",
          500: "#5b6e7c",
          600: "#465865",
          700: "#35444e",
          800: "#262f36",
          900: "#1b2227",
        },
        mint: {
          50: "#ecfffa",
          100: "#c9fff2",
          200: "#95ffe6",
          300: "#5af8d6",
          400: "#1fe6c1",
          500: "#10ccb0",
          600: "#0ea399",
          700: "#0d807b",
          800: "#0b6462",
          900: "#0a504f",
        },

        // C) Sandstone Teal (warm + fresh)
        sand: {
          50: "#fbf7f2",
          100: "#f4eadb",
          200: "#e8d4b7",
          300: "#dbbb8e",
          400: "#cfa26b",
          500: "#c28a4c",
          600: "#a8713d",
          700: "#865831",
          800: "#6a4628",
          900: "#553a22",
        },
        teal: {
          50: "#eafaf9",
          100: "#c8f1ee",
          200: "#95e3dd",
          300: "#5fd1c8",
          400: "#29b9b0",
          500: "#119fa1",
          600: "#0f7e84",
          700: "#0f6369",
          800: "#0f4e54",
          900: "#0e3f45",
        },

        // D) Plum Steel (boutique fintech)
        plum: {
          50: "#fbf5ff",
          100: "#f3e6ff",
          200: "#e2c8ff",
          300: "#caa0fb",
          400: "#a96cee",
          500: "#8b46d8",
          600: "#6f32b3",
          700: "#592792",
          800: "#452173",
          900: "#351b59",
        },
        steel: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d7dbe3",
          300: "#b5bed0",
          400: "#8594b0",
          500: "#5c6b89",
          600: "#46526b",
          700: "#354056",
          800: "#293346",
          900: "#1d2433",
        },
      },

      /* ===== Shadows / Radii / Fonts ===== */
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        elevated: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        premium: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.06), 0 2px 6px -1px rgb(0 0 0 / 0.06)",
        lift: "0 8px 24px -8px rgb(0 0 0 / 0.25)",
        glow: "0 0 0 2px rgb(245 176 0 / 0.15), 0 10px 30px -12px rgb(245 176 0 / 0.35)",
        regalGlow: "0 0 0 2px rgb(245 176 0 / 0.20), 0 10px 30px -12px rgb(139 70 216 / 0.35)",
      },
      borderRadius: { xl2: "1rem" },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },

      /* ===== Backgrounds / Animations ===== */
      backgroundImage: {
        "premium-gradient":
          "linear-gradient(135deg, rgba(240,249,244,0.8) 0%, rgba(254,252,232,0.6) 100%)",
        "card-shimmer":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 100%)",

        // Radials per theme
        "noct-radial":
          "radial-gradient(1200px 600px at 10% -10%, rgba(53,89,182,.16), transparent), radial-gradient(800px 400px at 100% 0%, rgba(245,176,0,.18), transparent)",
        "carbon-radial":
          "radial-gradient(1200px 600px at 10% -10%, rgba(16,204,176,.15), transparent), radial-gradient(800px 400px at 100% 0%, rgba(91,110,124,.25), transparent)",
        "sand-radial":
          "radial-gradient(1200px 600px at 10% -10%, rgba(194,138,76,.22), transparent), radial-gradient(800px 400px at 100% 0%, rgba(17,159,161,.18), transparent)",
        "plum-radial":
          "radial-gradient(1200px 600px at 10% -10%, rgba(139,70,216,.18), transparent), radial-gradient(800px 400px at 100% 0%, rgba(92,107,137,.22), transparent)",
        "regal-radial": "radial-gradient(1200px 600px at 10% -10%, rgba(139,70,216,.18), transparent), radial-gradient(800px 400px at 100% 0%, rgba(245,176,0,.20), transparent)",
        "regal-tint": "linear-gradient(180deg, rgba(139,70,216,0.20) 0%, rgba(245,176,0,0.14) 40%, rgba(16,185,129,0.18) 100%)",
        "regal-tint-dark": "linear-gradient(180deg, rgba(53,21,83,0.70) 0%, rgba(94,67,0,0.30) 40%, rgba(1,55,36,0.55) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      /* ===== Typography ===== */
      typography: {
        regal: {
          css: {
            '--tw-prose-body': 'rgb(24 24 27)', /* zinc-900 style */
            '--tw-prose-headings': 'rgb(18 16 24)',
            '--tw-prose-links': 'rgb(245 176 0)',
            '--tw-prose-bullets': 'rgb(88 28 135)',
            maxWidth: '80ch',
            'h1': { fontWeight: '800', letterSpacing: '-0.02em', fontSize: '2.4rem', lineHeight: '1.1' },
            'h2': { fontWeight: '800', letterSpacing: '-0.01em', fontSize: '1.9rem', lineHeight: '1.15' },
            'h3': { fontWeight: '700', fontSize: '1.4rem', lineHeight: '1.2' },
            'p, li': { fontSize: '1.125rem', lineHeight: '1.8' }, /* 18px */
            'blockquote p': { color: 'rgb(250 250 255)', fontWeight: '600' },
            'blockquote': { backgroundColor: 'rgba(139,70,216,0.08)', borderLeft: '4px solid rgba(245,176,0,0.6)', padding: '1rem 1.25rem', borderRadius: '0.75rem' },
            'table': { width: '100%', borderRadius: '0.5rem', overflow: 'hidden' },
            'thead th': { background: 'rgba(139,70,216,0.08)' },
            'tbody tr': { borderBottom: '1px solid rgba(0,0,0,0.06)' },
            'pre': { backgroundColor: 'rgb(24 24 27)', color: 'white', borderRadius: '0.75rem', padding: '1rem 1.25rem' },
            'a': { textDecoration: 'underline', textUnderlineOffset: '4px' },
            'code': { fontSize: '0.95em' },
            'img': { borderRadius: '0.75rem' }
          }
        }
      },
    },
  },
  plugins: [typography, forms],
};

export default config;
