# Migration Report

Snapshot date: 2026-08-25  
Source: `https://storesconsulting.com/`

## Frozen WordPress inventory

The live REST API and public pages returned:

- 28 pages
- 32 posts
- 39 project/client entries
- 12 category archives
- 4 author archives
- 269 media records

The source changed from the planning inventory of 11 categories and 271 media records. The repository records the live snapshot rather than manufacturing the two absent media records or dropping the additional category.

`src/data/route-manifest.json` contains 393 source and new-route records: 390 are ready and three are held for review. `src/data/media-manifest.json` records the source URL, source ID, expected target, and download state for every WordPress media record.

The migration downloaded 266 current media originals plus the WordPress-generated image variants referenced by the source. The resulting preserved upload tree contains 2,080 files under `public/wp-content/uploads/`.

## Required source recovery

The live WordPress server returns `403` for these three registered public media records, so no source bytes were available to migrate:

- `/wp-content/uploads/revslider/techjournal/BW-Scroll.mp4`
- `/wp-content/uploads/revslider/techjournal/city_bg.jpg`
- `/wp-content/uploads/revslider/techjournal/iwatch_smallimage.jpg`

Recover the exact files from the WordPress host backup and place them at the paths above. Do not substitute generated content. `npm run validate` will continue to fail route parity until all three exist.

## Structural verification

The final local snapshot completed these gates:

- Astro content/type check: 38 source files, zero errors, warnings, or hints
- Production build: 123 public HTML pages plus the on-demand contact function
- HTML validation: passed, including duplicate-ID checks
- Internal links and assets: 3,392 references passed
- Intrinsic media: 125 image instances across generated pages, all with width and height
- Browser regression: 92 passed, 28 intentionally skipped by viewport/capability
- Viewports: 320, 390, 768, 1024, and 1440 pixels
- JavaScript-disabled core-route coverage: passed
- Critical/serious structural accessibility scan: passed
- Production dependency audit: zero known vulnerabilities

`npm run validate` currently stops only at the three unresolved media records above. The browser suite runs separately with `npm run test:e2e`.

## Inherited external-link findings

An external crawl was run against the preserved legacy content. These source-owned URLs currently return `404`:

- `http://lundsandbyerlys.com/wp-content/uploads/2014/06/ourHistory-image2.jpg`
- `https://lundsandbyerlys.com/about-us/our-history/`
- `http://www.thekrogerco.com/about-kroger/operations/grocery-retail`
- `https://media.wholefoodsmarket.com/about/`
- `https://media.wholefoodsmarket.com/wp-content/uploads/2022/02/2021_WFM_Mission_in_Action_H.pdf`
- `https://amlfoods.com/our-company.html`

The GetGo image host at `geweb.azureedge.net` no longer resolves. Its original source URL remains in the GetGo project narrative; a 16:9 intrinsic fallback box prevents layout shift while the image is unavailable. `https://oculogx.com/` timed out during the crawl, and the Weis Markets link returned a bot-facing `403`; verify both manually in the Vercel preview.

These links were not silently rewritten because this phase preserves legacy copy and source references. Resolve or approve each finding before cutover.

## Repository and remaining external dependencies

The private repository is live at `https://github.com/hmpsn/stores-consulting-site` with the implementation in draft PR #1. Marty still needs to be added after his GitHub username is supplied.

GitHub rejected branch protection for this private repository because the current personal account plan does not include that feature. Keep the PR-only convention manually for now, or enable protection after moving the repository to an eligible plan/organization. Do not make the repository public solely to unlock protection.

The following work requires owner access and therefore remains a launch gate:

- WordPress database, WXR, uploads, and DNS backups
- Josh-owned Vercel project and preview deployment
- Josh's Resend test instance/API credentials and a delivery test
- Vercel Firewall rate limiting for the contact endpoint; Turnstile was intentionally removed
- Domain/DNS access and the 30-day WordPress rollback window
- Existing GA4 ownership confirmation before re-enabling measurement

Infrastructure decision recorded 2026-08-25: Josh owns GitHub and Vercel, shares the repository with Marty, and uses his Resend instance during testing. The connected Vercel integration currently exposes no team/account scope and the local CLI is not authenticated, so preview deployment still requires Vercel authorization. Production environment variables, DNS records, analytics property, and provider accounts remain unchanged until the preview is accepted.
