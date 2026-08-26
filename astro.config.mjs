// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

export default defineConfig({
  site: 'https://storesconsulting.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/styleguide/'),
    }),
    tina(),
  ],
  trailingSlash: 'ignore',
  redirects: {},
  vite: {
    plugins: [tinaAdminDevRedirect()],
    build: {
      cssMinify: true,
    },
  },
});
