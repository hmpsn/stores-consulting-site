import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import YAML from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://storesconsulting.com';
const API = `${ORIGIN}/wp-json/wp/v2`;
const CONCURRENCY = 8;
const explicitRoutes = new Set([
  '/',
  '/about/',
  '/approach/',
  '/results/',
  '/clients/',
  '/services/',
  '/contact-us/',
  '/tscg-blog/',
]);

const turndown = new TurndownService({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  headingStyle: 'atx',
});
turndown.keep(['iframe', 'video', 'audio']);
const externalMediaDimensions = new Map([
  ['https://geweb.azureedge.net/-/media/Images/Giant-Eagle/GG/Articles/about-us-01.ashx?la=en&hash=86441077B3C68E44DAF78EC21B73C12486C64C05', { width: 1600, height: 900 }],
  ['https://tops-graphics.grocerywebsite.com/G_AboutUs/TOPS1331_AboutUs_LandingPage_Refresh_HistoryGraphic1.jpg', { width: 212, height: 170 }],
  ['https://tops-graphics.grocerywebsite.com/G_AboutUs/TOPS1331_AboutUs_LandingPage_Refresh_HistoryGraphic2.jpg', { width: 212, height: 170 }],
  ['https://tops-graphics.grocerywebsite.com/G_AboutUs/TOPS1331_AboutUs_LandingPage_Refresh_HistoryGraphic3.jpg', { width: 212, height: 170 }],
  ['https://tops-graphics.grocerywebsite.com/G_AboutUs/TOPS1331_AboutUs_LandingPage_Refresh_HistoryGraphic4.jpg', { width: 212, height: 170 }],
]);
let mediaDimensions = new Map(externalMediaDimensions);
const escapeAttribute = (value) => String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
turndown.addRule('images-with-dimensions', {
  filter: 'img',
  replacement(_content, node) {
    const src = node.getAttribute('src') || '';
    const known = mediaDimensions.get(src);
    const width = node.getAttribute('width') || known?.width;
    const height = node.getAttribute('height') || known?.height;
    const dimensions = width && height ? ` width="${escapeAttribute(width)}" height="${escapeAttribute(height)}"` : '';
    return `\n\n<img src="${escapeAttribute(src)}" alt="${escapeAttribute(node.getAttribute('alt'))}"${dimensions} loading="lazy">\n\n`;
  },
});
turndown.addRule('referenced-legacy-anchors', {
  filter(node) {
    return node.nodeType === 1 && node.hasAttribute('id');
  },
  replacement(content, node) {
    return `\n\n<span id="${escapeAttribute(node.getAttribute('id'))}"></span>\n\n${content}\n\n`;
  },
});

function decode(value = '') {
  return cheerio.load(`<span>${value}</span>`).text().trim();
}

function routeFromUrl(url) {
  const path = new URL(url, ORIGIN).pathname;
  return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
}

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

function frontmatter(data, body = '') {
  return `---\n${YAML.stringify(data).trim()}\n---\n\n${body.trim()}\n`;
}

function summarize(markdown, fallback) {
  const plain = markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return fallback;
  const candidate = plain.match(/^.{1,155}(?:[.!?](?=\s|$)|$)/)?.[0] || plain.slice(0, 155);
  return candidate.trim();
}

async function fetchWithRetry(url, options = {}, attempts = 4) {
  let error;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'user-agent': 'tSCG-Astro-Migration/1.0 (+https://storesconsulting.com)',
          ...options.headers,
        },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
      return response;
    } catch (caught) {
      error = caught;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
  throw error;
}

async function fetchAll(endpoint, params = {}) {
  const items = [];
  for (let page = 1; ; page += 1) {
    const url = new URL(`${API}/${endpoint}`);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    const response = await fetchWithRetry(url);
    const batch = await response.json();
    items.push(...batch);
    const pages = Number(response.headers.get('x-wp-totalpages') || 1);
    if (page >= pages) return items;
  }
}

function sanitizeRenderedHtml(html, fallbackAlt = '') {
  const $ = cheerio.load(`<main id="migration-root">${html || ''}</main>`, null, false);
  const root = $('#migration-root');
  root.find('[class*="et_pb_section"]').each((_, section) => {
    const text = $(section).text().replace(/\s+/g, ' ').trim();
    if (text.length < 300 && text.includes('About') && text.includes('tSCG Services') && text.includes('tSCG Team') && text.includes('tSCG Clients') && text.includes('Contact Us')) {
      $(section).remove();
    }
  });
  $('script, style, noscript, form, button, input, select, textarea, link, meta').remove();
  $('video a, audio a').remove();
  $('[aria-hidden="true"]').remove();
  root.find('h1').each((_, heading) => { heading.tagName = 'h2'; });
  const referencedAnchorIds = new Set();
  root.find('a[href]').each((_, anchor) => {
    try {
      const hash = new URL($(anchor).attr('href'), ORIGIN).hash;
      if (hash.length > 1) referencedAnchorIds.add(decodeURIComponent(hash.slice(1)));
    } catch {
      // Malformed legacy links are left for the link checker to report.
    }
  });
  const retainedAnchorIds = new Set();
  $('*').each((_, element) => {
    const node = $(element);
    for (const attribute of Object.keys(element.attribs || {})) {
      if (attribute === 'id') {
        const id = node.attr('id');
        if (id && referencedAnchorIds.has(id) && !retainedAnchorIds.has(id)) {
          retainedAnchorIds.add(id);
        } else {
          node.removeAttr(attribute);
        }
        continue;
      }
      if (!['href', 'src', 'alt', 'title', 'width', 'height', 'loading', 'controls', 'poster', 'preload', 'allow', 'allowfullscreen', 'referrerpolicy'].includes(attribute)) {
        node.removeAttr(attribute);
      }
    }
    if (node.is('a') && node.attr('href')) {
      const href = node.attr('href');
      try {
        const url = new URL(href, ORIGIN);
        if (url.hostname === new URL(ORIGIN).hostname) {
          let pathname = url.pathname.replace(/^\/index\.php(?=\/|$)/, '') || '/';
          pathname = pathname.replace(/%20+$/i, '').replace(/\s+$/g, '') || '/';
          const replacements = new Map([
            ['/digital-consumer-profitability/', '/digital-consumer/'],
            ['/tscg-future/', '/tscg-future-page/'],
          ]);
          pathname = replacements.get(pathname) || pathname;
          node.attr('href', `${pathname}${url.search}${url.hash}`);
        }
      } catch {
        // Leave malformed legacy URLs for the link checker to flag.
      }
    }
    if (node.is('img') && node.attr('src')) {
      const src = node.attr('src');
      try {
        const url = new URL(src, ORIGIN);
        if (url.hostname === new URL(ORIGIN).hostname) node.attr('src', `${url.pathname}${url.search}`);
      } catch {
        // Leave malformed legacy URLs for the link checker to flag.
      }
      if (!node.attr('alt')) node.attr('alt', fallbackAlt);
      node.attr('loading', 'lazy');
    }
    if (node.is('source, video, audio') && node.attr('src')) {
      try {
        const url = new URL(node.attr('src'), ORIGIN);
        if (url.hostname === new URL(ORIGIN).hostname) node.attr('src', `${url.pathname}${url.search}`);
      } catch {
        // Leave malformed legacy URLs for the link checker to flag.
      }
    }
    if (node.is('iframe')) {
      if (!node.attr('title')) node.attr('title', fallbackAlt || 'Embedded content');
      node.attr('loading', 'lazy');
    }
  });
  return root.html() || '';
}

async function extractPublicContent(item) {
  try {
    const response = await fetchWithRetry(item.link);
    const html = await response.text();
    const $ = cheerio.load(html);
    const root = $('.entry-content').first();
    if (root.length) return sanitizeRenderedHtml(root.html(), decode(item.title?.rendered));
  } catch (error) {
    console.warn(`Public HTML fallback failed for ${item.link}: ${error.message}`);
  }
  return sanitizeRenderedHtml(item.content?.rendered || item.excerpt?.rendered || '', decode(item.title?.rendered));
}

function markdownFromHtml(html) {
  const markdown = turndown.turndown(html)
    .replace(/\[(?:et_pb|\/et_pb)[^\]]*\]/gi, '')
    .replace(/\scontrols="controls"/gi, ' controls')
    .replace(/\sallowfullscreen="allowfullscreen"/gi, ' allowfullscreen')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return markdown || '_No additional narrative content was present in the WordPress source._';
}

async function pool(items, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
}

async function writeText(relativePath, content) {
  const target = join(ROOT, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
}

async function downloadUpload(source) {
  if (!source) return { downloaded: false, reason: 'missing-source' };
  const sourceUrl = new URL(source, ORIGIN);
  if (!sourceUrl.pathname.startsWith('/wp-content/uploads/')) {
    return { downloaded: false, reason: 'external-or-non-upload', source };
  }
  const target = join(ROOT, 'public', sourceUrl.pathname);
  try {
    await access(target);
    return { downloaded: true, cached: true, path: sourceUrl.pathname };
  } catch {
    // Continue to download.
  }
  await mkdir(dirname(target), { recursive: true });
  const response = await fetchWithRetry(source);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(target, bytes);
  return { downloaded: true, cached: false, path: sourceUrl.pathname, bytes: bytes.length };
}

async function downloadMedia(item) {
  return downloadUpload(item.source_url);
}

async function main() {
  console.log('Fetching WordPress content inventory…');
  const [pages, posts, projects, media, categories, authors, projectCategories] = await Promise.all([
    fetchAll('pages', { context: 'view' }),
    fetchAll('posts', { context: 'view' }),
    fetchAll('project', { context: 'view' }),
    fetchAll('media', { context: 'view' }),
    fetchAll('categories', { hide_empty: 'false' }),
    fetchAll('users'),
    fetchAll('project_category', { hide_empty: 'false' }).catch(() => []),
  ]);

  const authorById = new Map(authors.map((author) => [author.id, author.slug]));
  const categoryById = new Map(categories.map((category) => [category.id, category.slug]));
  const projectCategoryById = new Map(projectCategories.map((category) => [category.id, category.slug]));
  const mediaById = new Map(media.map((asset) => [asset.id, asset]));
  mediaDimensions = new Map(externalMediaDimensions);
  for (const asset of media) {
    const candidates = [
      { source_url: asset.source_url, width: asset.media_details?.width, height: asset.media_details?.height },
      ...Object.values(asset.media_details?.sizes || {}),
    ];
    for (const candidate of candidates) {
      if (!candidate?.source_url) continue;
      const url = new URL(candidate.source_url, ORIGIN);
      mediaDimensions.set(url.pathname, { width: candidate.width, height: candidate.height });
    }
  }
  const manifest = [];

  await pool(pages, async (page) => {
    const route = routeFromUrl(page.link);
    const body = markdownFromHtml(await extractPublicContent(page));
    const title = decode(page.title?.rendered) || 'Untitled page';
    const excerpt = decode(page.excerpt?.rendered);
    const cleanExcerpt = /tSCG Services.*tSCG Team.*tSCG Clients.*Contact Us/i.test(excerpt) ? '' : excerpt;
    await writeText(`src/content/legacy-pages/${page.id}-${safeName(page.slug)}.md`, frontmatter({
      title,
      slug: page.slug,
      route,
      description: cleanExcerpt || summarize(body, title),
      originalUrl: page.link,
      updatedDate: page.modified,
      sourceId: page.id,
      overlapStrategy: explicitRoutes.has(route) ? 'mockup-primary' : 'legacy-preserved',
    }, body));
    manifest.push({ sourceUrl: page.link, sourcePath: route, targetPath: route, type: 'page', status: 200, sourceId: page.id });
  });

  await pool(posts, async (post) => {
    const route = routeFromUrl(post.link);
    const body = markdownFromHtml(await extractPublicContent(post));
    const featured = mediaById.get(post.featured_media);
    await writeText(`src/content/posts/${post.id}-${safeName(post.slug)}.md`, frontmatter({
      title: decode(post.title?.rendered) || 'Untitled post',
      slug: post.slug,
      route,
      excerpt: decode(post.excerpt?.rendered) || summarize(body, decode(post.title?.rendered) || 'tSCG article'),
      publishedDate: post.date,
      updatedDate: post.modified,
      author: authorById.get(post.author) || 'unknown',
      categories: (post.categories || []).map((id) => categoryById.get(id)).filter(Boolean),
      featuredMedia: featured ? routeFromUrl(featured.source_url).replace(/\/$/, '') : null,
      canonicalUrl: post.link,
      draft: false,
      sourceId: post.id,
    }, body));
    manifest.push({ sourceUrl: post.link, sourcePath: route, targetPath: route, type: 'post', status: 200, sourceId: post.id });
  });

  await pool(projects, async (project) => {
    const route = routeFromUrl(project.link);
    const body = markdownFromHtml(await extractPublicContent(project));
    const featured = mediaById.get(project.featured_media);
    const projectTerms = project.project_category || [];
    await writeText(`src/content/clients/${project.id}-${safeName(project.slug)}.md`, frontmatter({
      name: decode(project.title?.rendered) || 'Untitled client',
      slug: project.slug,
      route,
      category: projectTerms.map((id) => projectCategoryById.get(id)).filter(Boolean).join(', ') || 'legacy-client',
      tier: 'unspecified',
      logo: featured ? routeFromUrl(featured.source_url).replace(/\/$/, '') : null,
      legacyUrl: project.link,
      updatedDate: project.modified,
      sourceId: project.id,
    }, body));
    manifest.push({ sourceUrl: project.link, sourcePath: route, targetPath: route, type: 'project', status: 200, sourceId: project.id });
  });

  for (const category of categories) {
    const route = routeFromUrl(category.link);
    await writeText(`src/content/categories/${category.id}-${safeName(category.slug)}.yaml`, YAML.stringify({
      name: decode(category.name),
      slug: category.slug,
      route,
      description: decode(category.description),
      count: category.count,
      sourceId: category.id,
    }));
    manifest.push({ sourceUrl: category.link, sourcePath: route, targetPath: route, type: 'category', status: 200, sourceId: category.id });
  }

  for (const author of authors) {
    const route = routeFromUrl(author.link);
    await writeText(`src/content/authors/${author.id}-${safeName(author.slug)}.yaml`, YAML.stringify({
      name: decode(author.name),
      slug: author.slug,
      route,
      description: decode(author.description),
      avatar: author.avatar_urls?.['96'] || null,
      sourceId: author.id,
    }));
    manifest.push({ sourceUrl: author.link, sourcePath: route, targetPath: route, type: 'author', status: 200, sourceId: author.id });
  }

  console.log(`Downloading ${media.length} public media records…`);
  const mediaResults = [];
  await pool(media, async (asset) => {
    let result;
    try {
      result = await downloadMedia(asset);
    } catch (error) {
      result = { downloaded: false, reason: error.message };
    }
    const variantUrls = [...new Set(Object.values(asset.media_details?.sizes || {}).map((size) => size?.source_url).filter(Boolean))];
    for (const variantUrl of variantUrls) {
      try {
        await downloadUpload(variantUrl);
      } catch {
        // The original record remains authoritative; referenced variants are caught by link validation.
      }
    }
    const sourcePath = new URL(asset.source_url || asset.link, ORIGIN).pathname;
    mediaResults.push({
      sourceId: asset.id,
      sourceUrl: asset.source_url,
      sourcePath,
      title: decode(asset.title?.rendered),
      alt: asset.alt_text || '',
      caption: decode(asset.caption?.rendered),
      mimeType: asset.mime_type,
      width: asset.media_details?.width || null,
      height: asset.media_details?.height || null,
      ...result,
    });
    manifest.push({ sourceUrl: asset.source_url, sourcePath, targetPath: sourcePath, type: 'media', status: result.downloaded ? 200 : 'review', sourceId: asset.id });
  });

  const fixedRoutes = [
    '/approach/', '/results/',
    '/services/shrink-profit-recovery/',
    '/services/fresh-inventory-operations/',
    '/services/workforce-store-execution/',
    '/services/technology-adoption-change-management/',
    '/feed/', '/robots.txt', '/sitemap-index.xml',
  ];
  for (const route of fixedRoutes) manifest.push({ sourceUrl: null, sourcePath: null, targetPath: route, type: 'new', status: 200 });

  manifest.sort((a, b) => (a.targetPath || '').localeCompare(b.targetPath || ''));
  mediaResults.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  await writeText('src/data/route-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
  await writeText('src/data/media-manifest.json', `${JSON.stringify(mediaResults, null, 2)}\n`);
  await writeText('src/data/migration-summary.json', `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: ORIGIN,
    counts: {
      pages: pages.length,
      posts: posts.length,
      projects: projects.length,
      categories: categories.length,
      projectCategories: projectCategories.length,
      authors: authors.length,
      media: media.length,
    },
  }, null, 2)}\n`);

  const failedMedia = mediaResults.filter((item) => !item.downloaded);
  console.log(`Migration generated: ${pages.length} pages, ${posts.length} posts, ${projects.length} projects, ${media.length} media.`);
  if (failedMedia.length) {
    console.warn(`${failedMedia.length} media records require review. See src/data/media-manifest.json.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
