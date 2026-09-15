// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://thames1990.github.io',
  integrations: [tailwind({ applyBaseStyles: false })],
});
