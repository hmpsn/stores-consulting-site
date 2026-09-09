# Tina Editor & Team Handoff

Tina edits the same Git-backed content records used by the Astro build. Their team can save and publish without Josh's approval; larger layout or code changes use the repository.

## What the team can edit

| Collection | Coverage |
|---|---|
| Homepage | Copy, actions, evidence, metrics and images |
| About, Approach, Results, Clients and Blog index | Page/search copy, existing section content, methodology steps, results lists and approved client-logo gallery |
| Services Index and Services | Introduction, all four service pages, workstreams, metrics, images and closing CTAs |
| Contact Page | Public contact details, introduction, form labels and messages |
| People & bios | Names, roles, team groups, bios, optional portraits; new people can be added |
| Blog posts | Titles, excerpts, dates, author/category associations, body and featured images; new posts can be added |
| Client profiles | Names, logos and profile body; new profiles can be added |
| Blog authors and categories | Display names and archive descriptions |
| Preserved pages | Public legacy page copy and body; superseded WordPress versions of primary pages are excluded from the editor |
| Navigation, footer & default CTA | Navigation labels, footer headings/details and the default closing action |

Existing routes, filenames, migration identifiers and component layout stay protected. Existing records cannot be deleted from Tina. Styleguide, 404/system messages, template labels such as breadcrumbs, CSS and code remain developer-maintained.

Older article/profile/page bodies use a Markdown text field to preserve their embedded legacy HTML without a lossy rich-text conversion. Plain paragraphs, lists, emphasis and Markdown links are editable there; retain existing HTML/image structures. A new layout or structural rewrite belongs in the codebase.

## Editing locally

Run `npm ci`, then `npm run dev`, and open `http://localhost:4321/admin/`. Choose **Enter Edit Mode**. No Tina account is required locally; Save writes to the working tree and does not publish online.

Choose a collection from the navigation menu or click an editable region in the preview. Related records, such as people on About, appear under **Referenced Files**. Save changes and check the source diff. If a schema change reloads the local editor bundle, reload `/admin/` to refresh its forms.

New posts begin as drafts. Drafts are edited in the collection form and excluded from public routes, archives and RSS. Turn off **Draft** when ready to publish. New public routes become available after the next successful site build; a dev-server restart may be necessary when adding records locally. Existing published URLs do not change when a title changes.

## Production accounts and direct publishing

Confirmed by Josh on 2026-09-08:

- GitHub stays under Josh; their technical team receives repository access.
- Vercel stays under Josh unless their team prefers its own account. Transfer can happen later.
- Update 2026-09-09: Josh connected the repository through his Tina account for now (user-reported). Team ownership can follow later. Individual login count is still to be settled; a shared login was suggested but its suitability has not been confirmed.
- Their team replaces imagery as needed. Current imagery stays for the handoff.

Setup:

1. Verify the TinaCloud project Josh connected to `hmpsn/stores-consulting-site` and its GitHub App permissions.
2. Add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` to Vercel. Keep the token server/build-only.
3. Configure the production editor to read/save `main`. Give the TinaCloud App permission to commit there. Invite the intended editors.
4. Enable production deployments for Tina commits to `main`. Saving publishes after the build succeeds; no Josh approval step. Code changes continue through development branches and merges.
5. Test a Tina save → GitHub commit → production deployment, then a code merge → Tina refresh, verifying that both changes survive. Verify actual team-authored commits are deployable under the Vercel project permissions.

The configuration chooses `TINA_BRANCH` first, then the deployment's Git branch, then `main`. Avoid a blanket `TINA_BRANCH=main` on Preview deployments if they must edit an isolated preview branch.

[Tina pricing](https://tina.io/pricing), checked 2026-09-08: Free includes two total users and unlimited documents. Count any Josh/admin login within those two. Team includes three users at $29/month or $290/year. Confirm login count before choosing a paid plan.

[Vercel project transfer](https://vercel.com/docs/projects/transferring-projects) supports moving the site later; reconnect/review integrations during transfer.

## Git synchronization and recovery

TinaCloud saves Git commits and indexes GitHub updates through webhooks. Developers fetch and merge/rebase current production changes before merging code work. Never force-push production or replace content from a stale checkout. Concurrent edits to the same content can require conflict resolution.

To undo a published content change, revert its Git commit and deploy the resulting commit. A failed deployment leaves the previous successful version live. Do not restore an old deployment and then assume its content has also been restored in Git.

The WordPress migration scripts are historical import tools. Do not rerun them over edited content as a publishing step.

## Images

Tina manages `public/assets/editorial/`. Legacy assets remain at their original `/wp-content/uploads/...` URLs and are not exposed in the upload library.

Use descriptive filenames and optimized images. Structured page/service images include alternative text, width, height and crop position. For newly uploaded blog featured images, provide alternative text and dimensions; for new client logos, provide dimensions. Portraits use a square display crop. Existing imagery is retained unless the team chooses to replace it.

The contact email shown on the page is editable content; actual form delivery uses the server's `CONTACT_TO_EMAIL`. Production is intended to deliver to `contact@storesconsulting.com`. Changing the visible email does not silently reroute submissions.

## Developer validation

- Tina schemas: `tina/config.ts`, `tina/extended-schema.ts`
- Astro schemas: `src/content.config.ts`, `src/lib/marketing-schema.ts`
- Editable components and island registry: `src/components/editable/`, `src/lib/tina-islands.ts`
- Data queries: `src/lib/tina-data.ts`, `src/lib/tina-extended-data.ts`

When adding fields, update both schemas and the relevant render component. Keep the existing appearance and claims. Generated `tina/tina-lock.json` belongs in the review batch.

Run `npm run tina:audit`, `npm run validate`, and `npm run test:e2e`. Stop the local Tina dev server before running the audit/build commands to avoid port conflicts. `npm run build` also checks route collisions, taxonomy references and required managed-image metadata before publishing.

Cloud account connection, hosted save/deploy synchronization and real email delivery remain pending. Local verification does not establish those gates.
