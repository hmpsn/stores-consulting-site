# the Stores Consulting Group website

Production rebuild of storesconsulting.com using Astro 7, strict TypeScript, Node 24, npm, and the Vercel adapter.

```bash
npm ci
npm run dev
npm run migrate        # developer-only WordPress/mockup import
npm run validate       # schemas, types, build, HTML, links, route parity
npm run test:e2e       # viewport and accessibility checks
```

All public pages are prerendered. `POST /api/contact` is the only on-demand Vercel Function. Environment variables are documented in `.env.example`.

Pull requests create Vercel previews. `main` is production and requires one human approval. DNS cutover is allowed only after route parity, contact delivery, mobile/accessibility checks, backup capture, and analytics ownership confirmation. Keep WordPress available for 30 days after cutover.

Read `docs/CONTENT-EDITING.md` and `AGENTS.md` before editing content.

The local visual editor is available at `/admin/` while `npm run dev` is running. It currently covers the homepage, services index, contact page, and all four service pages. Local editing requires no account; hosted team access uses individual TinaCloud accounts. See `docs/TINA-EDITOR.md` for the complete workflow and media limits.

The living interface reference is available at `/styleguide/` while the site is running locally. It renders the actual tokens and shared components used by production pages and is excluded from navigation and the sitemap.

## Current migration status

The generated application, HTML, metadata, and internal-link gates pass. Route parity has three documented WordPress-media exceptions that currently return `403` and must be recovered from the host backup before cutover. See `docs/MIGRATION-REPORT.md` for the frozen inventory, verification results, inherited external-link findings, and remaining launch dependencies.
