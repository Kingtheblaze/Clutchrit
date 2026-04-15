/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--void)",
        surface: {
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        acid: {
          DEFAULT: "var(--acid)",
          dim: "var(--acid-dim)",
        },
        fire: {
          DEFAULT: "var(--fire)",
          dim: "var(--fire-dim)",
        },
        ice: {
          DEFAULT: "var(--ice)",
          dim: "var(--ice-dim)",
        },
        text: {
          0: "var(--text-0)",
          1: "var(--text-1)",
          2: "var(--text-2)",
        },
        border: {
          DEFAULT: "var(--border)",
          bright: "var(--border-bright)",
        }
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        subheading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'acid-glow': 'var(--acid-glow)',
        'fire-glow': 'var(--fire-glow)',
      },
      cursor: {
        none: 'none',
      }
    },
  },
  plugins: [],
}
