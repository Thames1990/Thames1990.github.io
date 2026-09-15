import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#101214',
        paper: '#f1efe9',
        muted: '#73736d',
        line: '#d4d1c9',
        accent: '#ef6b4a',
        blue: '#b8d7d8',
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
