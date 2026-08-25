# Agent Working Agreement

Read `AGENTS.md` before making changes. Unless a developer explicitly authorizes code work, edit only `src/content/**` and approved assets under `public/assets/**`.

## Interface reference

Before building or changing a page, review the living style guide at `/styleguide/` in the local preview and its source at `src/pages/styleguide/index.astro`. Tokens and shared structural classes live in `src/styles/global.css`; reusable interface components live in `src/components/`.

- Reuse an existing token, class, or component before introducing a new pattern.
- Do not copy component markup into content files.
- New visual constants must be named CSS custom properties when they represent a reusable decision.
- When an authorized structural change adds or changes a reusable pattern, update the style guide in the same pull request.
- The style guide is unlinked, excluded from the sitemap, and marked `noindex`; it is an implementation reference, not a public marketing page.

Before proposing a pull request:

- Keep narrative copy in Markdown and structured fields in YAML.
- Preserve routes and approved claims.
- Do not add layout HTML, CSS, JavaScript, or Divi shortcodes to content.
- Run `npm run validate` and resolve every failure.
- Use a branch and Vercel preview; do not push directly to production.

Full schemas and examples are in `docs/CONTENT-EDITING.md`.
