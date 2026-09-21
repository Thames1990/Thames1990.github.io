import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        blue: 'rgb(var(--color-blue) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        ember: 'rgb(var(--color-ember) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        veil: 'rgb(var(--color-veil) / <alpha-value>)',
        good: 'rgb(var(--color-good) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['Georgia', 'ui-serif', 'serif'],
      },
      maxWidth: {
        shell: '1180px',
      },
    },
  },
  plugins: [typography],
};
