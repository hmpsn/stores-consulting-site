# Tina Visual Editor

TinaCMS is the Git-backed visual editing layer for the Astro site. It exposes approved content fields without exposing components, CSS, route identifiers, or migration data.

## Current pilot

Editable in the pilot:

- Homepage copy, actions, metrics, evidence content, and two image placements
- Services-index introduction
- Contact-page introduction and public contact details
- All four service titles, summaries, theses, workstreams, metrics, notes, and optional images
- Image selection, upload, alternative text, intrinsic dimensions, and crop position

Not yet editable through Tina:

- About, approach, results, and clients marketing pages
- People, posts, client/project profiles, categories, authors, and legacy pages
- Header, footer, global CTA, form labels, styleguide, CSS, components, routes, and migration metadata

Those records remain editable by agents through the existing Git workflow until their editor schemas and visual bindings are approved.

## Local editing

```bash
npm ci
npm run dev
```

Open `http://localhost:4321/admin/` and choose **Enter Edit Mode**. Local mode requires no login and saves directly to the checked-out content files. Review `git diff` after every editing session; do not push an editor session automatically.

## Team access in production

1. Create the TinaCloud project in the account that will ultimately belong to Marty's designated team.
2. Connect the GitHub repository and install the TinaCloud GitHub App only for this repository.
3. Add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` to the Vercel project. `TINA_TOKEN` is server/build-only; never expose it in browser code.
4. Invite each editor as a project collaborator. Editors sign in at `/admin/`; they do not need direct repository access.
5. Configure the selected editorial branch/review workflow before allowing production saves.
6. Configure Vercel to ignore or debounce intermediate editorial-branch commits. Create a hosted preview only when a batch is ready for review.

Without TinaCloud credentials, local builds automatically use Tina's local content server. When both credentials are available, `npm run build` generates the authenticated production editor while still building the public pages from repository content.

## Media

Tina manages only `public/assets/editorial/`. Existing WordPress assets remain available to the site at their preserved `/wp-content/uploads/...` URLs but are intentionally excluded from Tina's media library.

Editors can upload, select, replace, and delete managed images. They must also provide factual alternative text and intrinsic width/height. Tina does not retouch or crop the source file; the crop-position field changes how an image is framed by the site. To alter pixels, prepare and upload a new optimized asset.

Use lowercase descriptive filenames with hyphens. Do not upload generic placeholders or reuse unrelated stock imagery to fill space.

## Schema and validation

- Tina editor schema: `tina/config.ts`
- Astro validation schema: `src/content.config.ts`
- Visual bindings: `src/components/editable/`
- On-demand refresh endpoint: `src/pages/tina-island/[name].ts`

Whenever an editable field changes, update both schemas and its visual component. Then run:

```bash
npm run tina:audit
npm run validate
npm run test:e2e
```

The public pages remain statically generated. Only the contact endpoint and Tina island-refresh endpoint render on demand.
