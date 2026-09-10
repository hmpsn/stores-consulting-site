# Launch Runbook

## Before the final preview

- Export and securely archive the WordPress database, WXR export, and complete uploads directory.
- Recover the three public media records listed as `review` in `src/data/media-manifest.json` from the host backup. The live server currently returns 403 for them.
- Resolve or explicitly approve the inherited external-link findings in `docs/MIGRATION-REPORT.md`.
- Capture current DNS records and TTLs.
- Confirm ownership of GitHub, Vercel, Resend, the domain registrar, DNS, and GA4.
- Configure every variable in `.env.example` for Vercel Preview and Production.
- Josh confirmed existing GA4 measurement ID `G-73E0EDSM19` on 2026-09-09; production tracking uses that property. Verify received events and mark generate_lead as a key event once the property dashboard is accessible. Do not create a replacement property.
- Configure the available GitHub protections for code changes while permitting the TinaCloud App to commit editorial saves directly to `main`. Team editors do not need Josh approval. Confirm private-repository plan support; the earlier setup could not enforce branch protection.

## Acceptance gate

```bash
npm ci
npm run validate
npx playwright install --with-deps chromium
npm run test:e2e
```

- Configure a Vercel Firewall rate limit for `POST /api/contact` before public launch; retain the application honeypot, same-origin check, server validation, and Resend idempotency.
- Test successful form delivery and Reply-To in a Vercel preview using Josh's Resend test instance and recipient.
- Production recipient: `contact@storesconsulting.com`, the general inbox on the contact page, selected by Josh on 2026-09-08. Set/verify `CONTACT_TO_EMAIL` accordingly and verify actual delivery before cutover; the example environment and application fallback already match.
- Test cross-origin requests, duplicate submissions, honeypot submissions, provider failure, and browser-safe error messages.
- Crawl every route and media URL in `src/data/route-manifest.json` against the preview; all expected public records must return 200 without redirects.
- Confirm titles, descriptions, canonicals, social metadata, RSS, sitemap, robots, 404 handling, and analytics continuity.
- Pass contrast, keyboard navigation and responsive checks against the selected Shelf Register / Field Manual system.

## Cutover

Josh does not control their DNS (confirmed 2026-09-08). Their team must bring registrar/DNS access to the sync meeting. Prepare the exact domain changes after inspecting the current records; this dependency does not block preview review or editor preparation. Preserve existing email-related DNS records.

- Lower DNS TTL before launch.
- Attach `storesconsulting.com` and `www.storesconsulting.com` to the accepted Vercel production project.
- Change DNS only after route parity, form delivery, mobile checks, and backups pass.
- Keep the prior WordPress host intact for 30 days. Roll back DNS if critical routes, form delivery, or analytics fail.

## Monitoring

- Days 1–7: review Vercel runtime logs, Resend delivery, GA4 continuity, and 404s daily.
- Day 14: repeat route/media crawl and review support issues.
- Day 30: repeat checks, confirm no rollback need, then approve WordPress host retirement.

Ownership decision, 2026-09-08: GitHub stays under Josh with their technical team invited to the repository. Vercel stays under Josh unless their team requests its own setup; transfer can happen later. Update 2026-09-09: Josh connected the repo through his Tina account for now; team ownership can follow later. A GitHub/Vercel ownership transfer is not a handoff gate. Confirm registrar/DNS and production email ownership separately.
