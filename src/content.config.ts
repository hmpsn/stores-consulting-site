import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const nullablePath = z.string().startsWith('/').nullable();
const metric = z.object({
  value: z.string(),
  label: z.string(),
});
const workstream = z.object({
  title: z.string(),
  description: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number().int().positive(),
    eyebrow: z.string(),
    summary: z.string(),
    thesisLabel: z.string(),
    thesis: z.string(),
    workstreams: z.array(workstream).length(6),
    metrics: z.array(metric).min(3),
    metricsNote: z.string(),
    relatedPaths: z.array(z.string().startsWith('/')).min(1),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tier: z.enum(['leadership', 'director', 'managing-consultant', 'senior-consultant']),
    order: z.number().int().positive(),
    image: nullablePath,
    alt: z.string(),
  }),
});

const clients = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/clients' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    category: z.string(),
    tier: z.enum(['national', 'regional', 'unspecified']),
    logo: nullablePath,
    legacyUrl: z.url(),
    updatedDate: z.coerce.date(),
    sourceId: z.number().int().positive(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    excerpt: z.string(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string(),
    categories: z.array(z.string()),
    featuredMedia: nullablePath,
    canonicalUrl: z.url(),
    draft: z.boolean(),
    sourceId: z.number().int().positive(),
  }),
});

const legacyPages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/legacy-pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    description: z.string(),
    originalUrl: z.url(),
    updatedDate: z.coerce.date(),
    sourceId: z.number().int().positive(),
    overlapStrategy: z.enum(['mockup-primary', 'legacy-preserved']),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    description: z.string(),
    count: z.number().int().nonnegative(),
    sourceId: z.number().int().positive(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    route: z.string().startsWith('/'),
    description: z.string(),
    avatar: z.url().nullable(),
    sourceId: z.number().int().positive(),
  }),
});

export const collections = { services, people, clients, posts, 'legacy-pages': legacyPages, categories, authors };
