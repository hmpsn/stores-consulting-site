import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/client');
const manifest = JSON.parse(await readFile(join(ROOT, 'src/data/route-manifest.json'), 'utf8'));
const failures = [];
const documentedExceptions = [];

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function built(pathname) {
  if (pathname === '/') return exists(join(DIST, 'index.html'));
  if (pathname === '/feed/') return (await exists(join(DIST, 'feed'))) || exists(join(DIST, 'feed/index.html'));
  if (pathname.endsWith('/')) return exists(join(DIST, pathname.slice(1), 'index.html'));
  return exists(join(DIST, pathname.slice(1)));
}

const seen = new Set();
for (const route of manifest) {
  if (!route.targetPath) continue;
  const key = `${route.type}:${route.targetPath}`;
  if (seen.has(key)) failures.push(`duplicate manifest entry ${key}`);
  seen.add(key);
  if (route.retired && route.status === 404) {
    if (await built(route.targetPath)) failures.push(`${route.targetPath}: retired post still exists`);
    continue;
  }
  if (route.status === 'review') {
    documentedExceptions.push(route.targetPath);
    continue;
  }
  if (route.status !== 200) {
    failures.push(`${route.targetPath}: manifest status is ${route.status}`);
    continue;
  }
  if (!(await built(route.targetPath))) failures.push(`${route.targetPath}: missing build output`);
}

if (failures.length) {
  console.error(`Route parity failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${manifest.length} route and media manifest entries (${documentedExceptions.length} documented review exceptions).`);
  for (const route of documentedExceptions) console.log(`- review: ${route}`);
}
