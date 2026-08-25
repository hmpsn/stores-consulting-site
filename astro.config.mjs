// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://storesconsulting.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap({
    filter: (page) => !page.endsWith('/styleguide/'),
  })],
  trailingSlash: 'ignore',
  redirects: {},
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
