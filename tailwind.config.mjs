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
        violet: 'rgb(var(--color-violet) / <alpha-value>)',
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
        serif: ['"Newsreader"', 'ui-serif', 'Georgia', 'serif'],
      },
      maxWidth: {
        shell: '1180px',
      },
      keyframes: {
        'aurora-a': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(6%, 8%) scale(1.12)' },
          '66%': { transform: 'translate(-4%, 4%) scale(0.94)' },
        },
        'aurora-b': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '40%': { transform: 'translate(-8%, -5%) scale(1.08)' },
          '70%': { transform: 'translate(5%, -8%) scale(0.96)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
      },
      animation: {
        'aurora-a': 'aurora-a 22s ease-in-out infinite',
        'aurora-b': 'aurora-b 26s ease-in-out infinite',
        blink: 'blink 1.6s ease-in-out infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [typography],
};
