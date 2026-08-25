// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://storesconsulting.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  trailingSlash: 'ignore',
  redirects: {},
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
