# Launch Runbook

## Before the final preview

- Export and securely archive the WordPress database, WXR export, and complete uploads directory.
- Recover the three public media records listed as `review` in `src/data/media-manifest.json` from the host backup. The live server currently returns 403 for them.
- Resolve or explicitly approve the inherited external-link findings in `docs/MIGRATION-REPORT.md`.
- Capture current DNS records and TTLs.
- Confirm ownership of GitHub, Vercel, Resend, the domain registrar, DNS, and GA4.
- Configure every variable in `.env.example` for Vercel Preview and Production.
- Verify the existing GA4 property before adding measurement ID `G-73E0EDSM19`; do not create a new property during migration.
- Configure GitHub branch protection for `main`: require the Validate workflow, one human approval, resolved conversations, and no direct pushes.

## Acceptance gate

```bash
npm ci
npm run validate
npx playwright install --with-deps chromium
npm run test:e2e
```

- Configure a Vercel Firewall rate limit for `POST /api/contact` before public launch; retain the application honeypot, same-origin check, server validation, and Resend idempotency.
- Test successful form delivery and Reply-To in a Vercel preview using Josh's Resend test instance and recipient.
- Test cross-origin requests, duplicate submissions, honeypot submissions, provider failure, and browser-safe error messages.
- Crawl every route and media URL in `src/data/route-manifest.json` against the preview; all expected public records must return 200 without redirects.
- Confirm titles, descriptions, canonicals, social metadata, RSS, sitemap, robots, 404 handling, and analytics continuity.
- Record contrast findings for the later design pass without changing the approved visual direction.

## Cutover

- Lower DNS TTL before launch.
- Attach `storesconsulting.com` and `www.storesconsulting.com` to the accepted Vercel production project.
- Change DNS only after route parity, form delivery, mobile checks, and backups pass.
- Keep the prior WordPress host intact for 30 days. Roll back DNS if critical routes, form delivery, or analytics fail.

## Monitoring

- Days 1–7: review Vercel runtime logs, Resend delivery, GA4 continuity, and 404s daily.
- Day 14: repeat route/media crawl and review support issues.
- Day 30: repeat checks, confirm no rollback need, then approve WordPress host retirement.

Domain, provider, and repository ownership must be transferred to Marty’s designated team accounts before handoff is complete.
