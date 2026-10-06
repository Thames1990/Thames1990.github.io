// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mohrworks.com',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});