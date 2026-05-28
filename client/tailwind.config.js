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
        'void-black': "var(--void-black)",
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
        'neon-cyan': "var(--neon-cyan)",
        'neon-magenta': "var(--neon-magenta)",
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
        'antigravity-cyan': '0 20px 40px -15px rgba(0, 240, 255, 0.3), 0 0 20px rgba(0, 240, 255, 0.1)',
        'antigravity-magenta': '0 20px 40px -15px rgba(255, 0, 127, 0.3), 0 0 20px rgba(255, 0, 127, 0.1)',
        'ag-modal': '0 0 60px rgba(0, 240, 255, 0.15), 0 0 120px rgba(255, 0, 127, 0.08)',
      },
      cursor: {
        none: 'none',
      }
    },
  },
  plugins: [],
}
