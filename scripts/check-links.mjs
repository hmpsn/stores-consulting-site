import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/client');
const ORIGIN = 'https://storesconsulting.com';
const failures = [];
let pagesChecked = 0;
let linksChecked = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

function publicRoute(file) {
  const route = relative(DIST, file).split(sep).join('/');
  if (route === 'index.html') return '/';
  if (route.endsWith('/index.html')) return `/${route.slice(0, -'index.html'.length)}`;
  return `/${route}`;
}

async function resolves(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded === '/feed/') return exists(join(DIST, 'feed/index.html'));
  if (decoded.endsWith('/')) return exists(join(DIST, decoded.slice(1), 'index.html'));
  const asset = join(DIST, decoded.slice(1));
  if (await exists(asset)) return true;
  return exists(join(DIST, decoded.slice(1), 'index.html'));
}

const files = (await walk(DIST)).filter((file) =>
  extname(file) === '.html' &&
  !file.includes(`${sep}wp-content${sep}`) &&
  !file.includes(`${sep}admin${sep}`)
);
for (const file of files) {
  pagesChecked += 1;
  const route = publicRoute(file);
  const html = await readFile(file, 'utf8');
  const $ = cheerio.load(html);
  const ids = new Set();
  $('[id]').each((_, element) => {
    const id = $(element).attr('id');
    if (!id) return;
    if (ids.has(id)) failures.push(`${route}: duplicate id #${id}`);
    ids.add(id);
  });
  if ($('main').length !== 1) failures.push(`${route}: expected one <main>, found ${$('main').length}`);
  if ($('h1').length !== 1) failures.push(`${route}: expected one <h1>, found ${$('h1').length}`);
  if (!$('title').text().trim()) failures.push(`${route}: missing title`);
  if (!$('meta[name="description"]').attr('content')?.trim()) failures.push(`${route}: missing meta description`);
  if (!$('link[rel="canonical"]').attr('href')) failures.push(`${route}: missing canonical URL`);
  if (!$('meta[property="og:title"]').attr('content')) failures.push(`${route}: missing social metadata`);

  for (const element of $('a[href], img[src], source[src], video[src]').toArray()) {
    const attribute = $(element).is('a') ? 'href' : 'src';
    const value = $(element).attr(attribute);
    if (!value || value.startsWith('#') || /^(mailto:|tel:|data:|javascript:)/.test(value)) continue;
    const url = new URL(value, `${ORIGIN}${route}`);
    if (url.origin !== ORIGIN) continue;
    linksChecked += 1;
    if (!(await resolves(url.pathname))) failures.push(`${route}: missing internal target ${url.pathname}`);
    if (url.hash && url.pathname === route && !ids.has(url.hash.slice(1))) failures.push(`${route}: missing anchor ${url.hash}`);
  }
}

if (failures.length) {
  console.error(`Internal link and metadata validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${pagesChecked} HTML pages and ${linksChecked} internal links/assets.`);
}
