# Tina editability audit

Date: 2026-09-09. Baseline: main `d720cad`. Audit only; no implementation or publication in this pass.

## Finding

Collection coverage is broad, but visual editing coverage is incomplete. A field existing in Tina does not mean clicking its text selects that field, or that every repeated appearance updates in the unsaved preview. The prior handoff checks established working collections and selected flows, not complete element-level coverage.

Reviewed all 14 editable render components, their shared presentation components, Tina schemas, data fetchers and island registry, plus navigation, contact feedback and the 404 page. Production spot-check: `/admin/index.html#/~/services/` loads Services Index with Metadata and Page introduction. Referenced Files contains the Services Index record and global settings, not the four service records. The Shrink & Profit Recovery card heading has neither a direct nor ancestor `data-tina-field`. No production values were changed or saved. Remaining findings below are source-traced; a full click/edit/save matrix is still needed during implementation. No percentage-complete claim is appropriate.

## Service links: three different owners

| Appearance | Current owner | Gap | Required change |
|---|---|---|---|
| Header/mobile/footer service labels | Global settings → Navigation (`shrink`, `fresh`, `workforce`, `technology`) | Fields exist, but HeaderContent/FooterContent do not bind text to them | Add precise field bindings to each label; expose a clear global editing shortcut |
| Homepage and Services Index cards | Services → Title / Summary | `getCollection('services')` bypasses Tina metadata/live queries; ServiceCards has no bindings | Fetch services through Tina with metadata and register them with the parent preview; bind each title/summary |
| Card action text and aisle prefix | `ServiceCards.astro` literals | “Explore this aisle →” and “Aisle” have no editor fields | Add shared service-card labels; keep numbering derived from order |
| Related-service links on posts/case studies | Generated `tina/editor-options.json` | Choices exist, but labels are build-time snapshots; no direct editing of their source title | Resolve displayed labels from current Tina records; bind source titles and the relationship selector |

Service titles and navigation labels are independent today. Recommend a service title as the default shared name with an optional short navigation label. Make intentional overrides clear rather than requiring editors to find and rename several copies. Preserve existing route URLs when renaming display text.

## Coverage and implementation backlog

| Priority / area | Existing editing support | Missing work and evidence |
|---|---|---|
| P1 — Header and footer | All navigation labels, footer headings, organization and location in global settings | `HeaderContent.astro` and `FooterContent.astro` have no field bindings. Add bindings for desktop/mobile labels, footer labels and legal text. Menu links should select labels in edit mode while retaining usable preview navigation. |
| P1 — Service cards | Titles/summaries editable in individual Services records | Connect Tina service queries in `HomepageContent.astro` / `ServicesIndexContent.astro`; add field-aware `ServiceCards.astro` as above. |
| P1 — Closing CTAs | Global defaults and page-specific overrides exist | `CtaContent.astro` has no bindings; `CtaBand.astro` creates a separate global island even when text comes from the service/page. Carry field ownership through overrides so clicking a service CTA edits that service, and clicking a default edits global settings. Test that global changes do not overwrite overrides. |
| P1 — Service details | Workstreams/results headings, metrics note, metrics/workstreams lists and closing copy exist | `ServicePageContent.astro` omits bindings on both section headings; Metrics/WorkstreamGrid use only broad list wrappers, and the metrics note sits under the metrics binding. Bind headings, each list item/value and the note to its actual field. |
| P1 — Marketing sections | About, Approach, Results, Clients and Blog have CMS records | Their page-wide `copy` binding is too coarse. Groups, lighthouse/foundations lists, resultGroups, and logos sit outside that copy object but inside its click wrapper. Bind actual fields/list items and add section-specific controls. Replace labels copied from old prose with stable descriptive labels; internal keys can remain unchanged initially. |
| P1 — People and client lists | People/client records already queried through Tina; some person name/image bindings exist | About roles/bodies and group titles lack precise bindings. Clients logos/names/links and profile directory lack correct item/record bindings. Connect each appearance to its source, distinguish featured logos from client profiles, and offer explicit edit-record actions. |
| P1 — Blog lists and metadata | Post/author/category records and association pickers exist | `BlogList.astro` and `BlogMeta.astro` have no field bindings. Blog index clicks fall under page copy; article metadata can fall under Body. Bind title/excerpt/date and clearly distinguish selecting an author/category association from renaming its source record. Adjacent article titles should open the referenced record. |
| P1 — Related content | Selectors exist on services/posts/case studies | `RelatedContent.astro` resolves labels from generated JSON. Service wrapper selects the list; editorial usage has no such binding. Keep generated JSON for schema options if needed, but use live records for rendered labels and add relationship edit controls, including empty lists. |
| P2 — Contact form | Field labels, button text and most feedback strings already exist in Contact → Form | `ContactPageContent.astro` has no field bindings on form labels/button/statuses. Add safe edit targets and a feedback preview; move the hardcoded rate-limit message from contact page JavaScript to the form schema. Never submit a real inquiry as an editor affordance. |
| P2 — Shared microcopy | Some labels are fields, others literals | Add grouped shared fields for blog read/watch/report actions, back/newer/older labels, PDF open label, case-study headings, related-section headings and editorial eyebrows. Homepage “tSCG · Engagement Outcomes” is also hardcoded. Breadcrumb root labels should use appropriate shared labels; counts/dates remain derived. |
| P2 — Editorial media and body | Featured images and Markdown bodies editable in forms; client logos have bindings | `EditorialPageContent.astro` does not pass the available media edit binding into PageIntro. Bind featured media and individual case-study fields. Body editing is a Markdown textarea, not direct paragraph editing; preserved HTML/video remains fragile for nontechnical users. Use structured media/link blocks for new content and migrate older bodies separately with fidelity checks. |
| P2 — Older case-study directory | Body available in Additional pages | `LegacyCaseStudyGrid.astro` extracts entries using a strict Markdown/HTML regex. Small formatting changes can remove cards. Replace with structured entries or references while preserving the existing URLs, images and copy. |
| P3 — System/identity text | Code-owned by current agreement | 404 copy/buttons and Brand wordmark are hardcoded. If literal all-visible-text coverage is desired, expose 404 text and agreed brand text in designated settings. Keep logo geometry, layout, routing, security/form mechanics and analytics code-owned. |

## Recommended completion standard

1. Every visible marketing heading, paragraph, link label and meaningful image selects its actual field or an explicit source-record editing action. No broad wrapper should send unrelated content to Page copy or Body.
2. Reused records update across the current preview before Save; after Save and a successful deployment, all affected public pages agree. Document intentional navigation-title overrides.
3. Link labels are editable without accidental navigation. Destinations use valid references or validated URLs; existing public slugs remain protected. Empty optional sections have a sidebar control even when nothing is visible to click.
4. Run a matrix across home, services index, all four service details, About, Approach, Results, Clients, blog index, article/video/report, client profile/case study, author/category archives, additional pages and contact. Include desktop/mobile navigation and shared CTAs/footer.
5. For each representative surface, test select → change → unsaved preview → save in an isolated branch/local fixture → render → reset/restore. Check duplicates, list add/remove, empty optional values and the owning document. Do not publish test copy or trigger real email delivery.
6. Keep current content/build/route/accessibility gates, and add editability assertions for shared components. A successful page load alone does not prove editing coverage.

Recommended implementation order: service cards + global labels + CTA ownership first; field-level bindings throughout marketing/editorial lists second; remaining microcopy and structured older content third. This is a focused CMS integration pass, not a visual redesign.

## Implementation follow-up

Implemented on `enhance/visual-editing-coverage`: Tina-backed service cards; synchronized service-title defaults with optional navigation overrides; precise shared/page/list bindings; CTA field ownership; live related-content labels; shared microcopy; contact feedback controls and no-delivery editor behavior; structured article media blocks; and 39 structured directory cards. Original directory titles/images/alt text/dimensions/dates/destinations compared against baseline and preserved.

P3 identity/system text stays code-owned as described above. Existing article HTML is preserved, with its text editable through the Markdown body field; there is no automatic rich-text conversion of older articles. New content may use structured blocks.

Local verification complete: full validation gate passed (117 HTML pages, 5,179 internal links/assets, 89 required navigation destinations, 393 route/media entries). Desktop/mobile public checks: 63 passed, 33 intentionally skipped. Editor matrix: 19 representative routes plus service save/restore, CTA preview/reset, contact no-send/feedback and structured-block add/reset checks passed. Four operations tests passed. Hosted validation passed. The wider browser suite found a duplicate client-logo visibility regression caused by the body wrapper; its selector was corrected and the existing 1106px layout regression test passed locally. Final hosted checks and deployment verification pending.
