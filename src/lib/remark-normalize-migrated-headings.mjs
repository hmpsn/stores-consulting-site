const migratedContentPath = /[/\\]src[/\\]content[/\\](?:posts|legacy-pages|clients)[/\\]/;

function plainText(node) {
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(plainText).join('');
}

function normalize(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

export default function remarkNormalizeMigratedHeadings() {
  return (tree, file) => {
    if (!migratedContentPath.test(file.path || '')) return;

    let frontmatter = file.data?.astro?.frontmatter || {};
    if (!frontmatter.title && !frontmatter.name && file.path) {
      const source = readFileSync(file.path, 'utf8');
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (match) frontmatter = parse(match[1]);
    }
    const templateTitle = frontmatter.title || frontmatter.name;
    const firstHeadingIndex = tree.children.findIndex((node) => node.type === 'heading');

    if (firstHeadingIndex >= 0 && templateTitle) {
      const firstHeading = tree.children[firstHeadingIndex];
      if (normalize(plainText(firstHeading)) === normalize(templateTitle)) {
        tree.children.splice(firstHeadingIndex, 1);
      }
    }

    const headings = tree.children.filter((node) => node.type === 'heading');
    if (headings.length === 0) return;

    const shallowestDepth = Math.min(...headings.map((heading) => heading.depth));
    const shift = shallowestDepth === 1 ? 1 : shallowestDepth > 2 ? 2 - shallowestDepth : 0;

    for (const heading of headings) {
      heading.depth = Math.max(2, Math.min(6, heading.depth + shift));
    }
  };
}
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
