# TableSizer SEO audit & backlink prospects — Phase 1
Date: Oct 18, 2026 (America/Chicago). Scope: audit + plan only. No code changes pushed, no outreach sent, nothing submitted anywhere.

## 1) Technical SEO audit (live https://tablesizer.com + built pages)
Live spot checks (Oct 18): `/`, a guide, `sitemap.xml`, `robots.txt` all return 200; a missing URL returns the branded 404 with HTTP 404; `www.tablesizer.com` 301s to the apex. (An HTTP→HTTPS check timed out from this sandbox and is left unverified, not counted as a defect.)

### Real defects (prioritized)
1. **✅ IMPLEMENTED (Oct 18, 2026) — Malformed Twitter card meta on every page — `build.js:10`.** The template emits `<meta name="twitter:image" content="${SITE}img/og-share.jpg>` with **no closing quote** before `>`, so the attribute swallows the following `twitter:card` meta. Twitter/X cards likely fall back to OG or fail. One-character fix in `build.js`, rebuild all pages. (Present verbatim in built `index.html` head.)
2. **✅ IMPLEMENTED (Oct 18, 2026) — Sitemap includes a utility page and has no `lastmod` — `sitemap.xml:1` (whole file is one line).** It lists `credits.html` (174 words, photography credits) alongside the 7 content pages, diluting crawl focus; no `lastmod` on any URL. Recommend removing `credits.html` from the sitemap (keep the page, linked in footer) and adding `lastmod` dates maintained by `build.js`.
3. **✅ IMPLEMENTED (Oct 18, 2026) — 404 page carries a self-canonical — built `404.html` (from `page()` in `build.js:6-15`, generated at `build.js:132`).** The noindex 404 declares `<link rel="canonical" href="https://tablesizer.com/404.html">`. Canonical on a noindex error page is contradictory; drop canonical (and OG URL) for the 404 only.
4. **✅ IMPLEMENTED (Oct 18, 2026) — Several titles/descriptions exceed display limits.** Titles: boardroom 75 chars (`boardroom-table-sizes.html`, generated `build.js:88`), layout guide 79 (`build.js:125`), dimensions 74 (`build.js:76`), makers 69 (`build.js:94`), reception 67 (`build.js:111`) — truncation risk in SERPs. Reception meta description is 159 chars (`build.js:111`). Tighten to ~60/~155 while keeping the target terms.
5. **✅ IMPLEMENTED (Oct 18, 2026, copy + ItemList schema; listings growth ongoing) — Thinnest money page is `/makers.html` — 239 words, no JSON-LD (all other content pages have FAQPage/Breadcrumb or WebApplication).** This page targets `custom furniture makers` (1,300/mo), `custom furniture near me` (2,400/mo) and `commercial furniture manufacturers` (480/mo) yet carries one maker and no structured data. Add an `ItemList`/`LocalBusiness`-style schema, maker comparison intro copy, and per-maker sections as listings grow.
6. **Guide word counts are serviceable but shallow for the terms targeted — 463–671 words** (boardroom 463, chart 516, dimensions 527, reception 635, layout 671). No author/date signals. The seat-count and shape guides in the roadmap (below) are the planned fix; add visible "last updated" dates when they ship.
7. **Homepage H1 carries no keyword.** Title is strong ("Conference Table Size Calculator & Room Planner | TableSizer", 60 chars), but the single H1 is "Your table, sized for your room." (`index.html`, `build.js` home template). This is a deliberate brand-copy trade-off; if rankings stall, an H1 like "Conference table size calculator & room planner" is the lever — Jake's call, not changed here.
8. **Page-weight nits (basics are fine).** Pages are 6–17 KB HTML with 100–150 KB guide imagery and no framework, but guide hero figures ship without `loading`/`fetchpriority` decisions, and `img/fargo-hero-conference.jpg` (176 KB) is now orphaned in the repo since the homepage hero was removed (repo weight only, not served weight). Fonts load from Google Fonts with `display=swap` (render-blocking CSS, acceptable).

### Verified OK (no action)
- Unique titles/meta descriptions and exactly one H1 on all 9 built pages; canonicals and OG tags present; `img/og-share.jpg` exists (1200×630).
- JSON-LD: home WebApplication+FAQ; all 5 guides + reception FAQPage+BreadcrumbList (visible FAQ sections match).
- All images have `alt`, `width`/`height`; internal links resolve (planner, guides, makers, credits cross-linked; Related Guides on guides); `robots.txt` allows all and references the sitemap.
- Known non-code blocker (from SEO-PLAN.md): Google Search Console verification + sitemap submission still needs Jake's Google sign-in.

## 2) Keyword → page map (volumes: Google Ads Keyword Planner via SEO-PLAN.md, Sep 2026 — not re-estimated)
| Keyword | Vol/mo | Page (status) |
|---|---|---|
| reception desk | 14,800 | /reception-desk-dimensions.html (live) |
| conference table | 8,100 | / planner (live) |
| custom furniture near me | 2,400 | /makers.html (live, thin — see defect 5) |
| custom furniture makers | 1,300 | /makers.html (live, thin) |
| boardroom table | 720 | /boardroom-table-sizes.html (live) |
| conference table dimensions / size | 480 | /conference-table-dimensions.html + /conference-table-size-chart.html (live) |
| commercial furniture manufacturers | 480 | /makers.html (live, thin) |
| custom reception desk | 390 | /reception-desk-dimensions.html (live) |
| custom conference table | 210 | / planner + /makers.html (live) |
| conference table size calculator | 10 | / planner (live; win via dimensions terms, per plan) |
| conference table for 12 / 14 / 16 people | not in plan data — do not target until Keyword Planner confirms | MISSING — roadmap guide 1 (seat-count pages from calc chart) |
| round conference table sizes | not in plan data | MISSING — roadmap guide 2 |
| U-shaped conference room layout | not in plan data | MISSING — roadmap guide 3 |
| conference table height & chair clearance | not in plan data | MISSING — roadmap guide 4 |
| boat-shaped conference table | not in plan data | MISSING — roadmap guide 5 |

## 3) Backlink prospect list (24 verified Oct 18, 2026 — fetch status noted; no outreach sent)
| # | Site | Type | Contact / submission path | Why it fits | Suggested pitch angle |
|---|---|---|---|---|---|
| 1 | **fargowoodworks.com** ⚠️ NEEDS JAKE APPROVAL | Own store (highest value) | Jake edits his own site | Same owner; commercial-intent audience already buying conference tables | Add a "Conference Table Size Calculator" link from a Fargo blog/resource page (and/or Hartford product page resources) to tablesizer.com, anchor exactly "Conference Table Size Calculator"; reciprocity already exists via the makers listing |
| 2 | saashub.com/submit (200) | Tool directory | https://www.saashub.com/submit | Free tool directories are the plan's no-account-needed channel | Submit TableSizer as a free office-planning tool with og-share.jpg kit |
| 3 | producthunt.com/launch (200) | Launch directory | https://www.producthunt.com/launch | Free launch listing; design/office-tools audience | Launch "free conference table size calculator" (needs Jake's PH account at submit time) |
| 4 | alternativeto.net (resolves; bot-403 to curl) | Tool directory | Add-software flow from site nav | Users search calculator alternatives (Omni Calculator, OfficeSimpli) | List as an alternative to generic room calculators |
| 5 | uneed.best (200) | Launch directory | Submit flow on site | Daily product launches, indie-tool audience | Same one-line kit as SaaSHub |
| 6 | fazier.com (200) | Launch directory | Submit flow on site | Free startup/product launches | Same kit |
| 7 | custom-conference-tables.com (200) | Furniture maker (Paul Downs) | /contact returned 200 | Already cited as our spacing source; his buyers size tables daily | Offer the planner as a free sizing resource for his size-guide readers; makers listing invite |
| 8 | vermontfarmtable.com (200) | Furniture maker | Contact via homepage (note: /contact is 404 — use homepage footer path) | Custom table maker, same buyer intent | Free makers listing on TableSizer + sizing-tool resource for customers |
| 9 | nevers.com (200) | Commercial furniture maker | Contact via homepage | Contract wood furniture for offices/education | Makers listing invite; planner as spec-stage resource |
| 10 | rieke.com (200) | Office interiors maker | Contact via homepage | Custom office interiors, Chicago-area trade | Makers/resource cross-reference for office projects |
| 11 | officesnapshots.com (200) | Office design media | https://officesnapshots.com/submit (200) | Publishes workplace project features read by designers/facilities | Submit a Fargo/TableSizer boardroom story with photography (Jake's images) |
| 12 | workdesign.com (200) | Workplace design magazine | https://www.workdesign.com/contact (200) | Editorial on workplace design; resource/tool coverage | Pitch a data piece: "what 30/36/42″ per person does to real room sizes" with planner as source |
| 13 | allwork.space (200) | Workplace/future-of-work media | https://allwork.space/contact (200) | Covers workplace planning tools and research | Tool/resource pitch for planners and facilities readers |
| 14 | facilityexecutive.com (resolves; bot-403) | Facilities magazine | Contact/advertise via homepage | Facilities executives spec furniture and rooms | Resource listing / contributed sizing checklist for facilities managers |
| 15 | facilitiesnet.com (200) | Facilities media | Contact via homepage | Building/facilities audience, buying guides | Sizing-guide resource for conference-room refresh articles |
| 16 | fmindustry.com (200) | Facilities media | Contact via homepage | FM news/resources | Same facilities checklist angle |
| 17 | ifma.org (200) | Facilities association (IFMA) | Membership/community via homepage | Largest FM association; resource libraries and chapters | Chapter resource / knowledge-base submission on room planning |
| 18 | corenetglobal.org (200) | Corporate real estate assoc. | Membership via homepage | CRE professionals plan HQ/boardroom space | Workplace-planning resource for CRE end users |
| 19 | boma.org (200) | Commercial real estate assoc. (BOMA) | Membership via homepage | Building owners/managers audience | Tenant-improvement resource: sizing rooms before leasing/build-out |
| 20 | cubiclebydesign.com (200) | Office furniture blog/content | /contact returned 200 | Already cited for clearance guidance; publishes sizing content | Offer the planner/chart as an embeddable resource for their size guides |
| 21 | officesimpli.com (200) | Office planning content (competitor-adjacent) | Contact via homepage | Publishes dimension guides we cite; resource pages link tools | Low priority: reciprocal resource mention on calculator roundups |
| 22 | spaceiq.com (200) | Workplace software/content | Contact via homepage | Workplace-planning blog read by facilities teams | Guest/resource piece on meeting-room sizing standards |
| 23 | officespacesoftware.com / archibus.com (200) | Workplace software | Contact via homepage | Facilities/space-planning readership | Resource link from meeting-room planning content |
| 24 | houzz.com/professionals (200) + thomasnet.com (resolves; bot-403) | Directories (trade) | Pro signup / supplier programs from homepages | Where buyers and trade search makers/furniture | Jake decision: directory presence also feeds /makers.html discovery; paid tiers exist — no spend without approval |

Also verified live but lower priority / long shots: gensler.com, hok.com (design-firm resource citations), asid.org, iida.org (design associations), finewoodworking.com, woodweb.com, customfurnituremakers.com, crehq.com, commercialsearch.com. HARO/Connectively and Pinterest remain Jake-account items already flagged in SEO-PLAN.md.

## 4) Implementation status
✅ Done Oct 18, 2026 (this pass): (1) Twitter meta quote fixed in `build.js` + rebuilt; (2) sitemap now generated by `build.js` with `lastmod`, credits removed; (3) 404 canonical removed; five long titles and the reception description trimmed (all titles ≤62 chars, descriptions ≤156 in tests); (4) `/makers.html` gained ItemList schema (Fargo Woodworks, labelled featured) and "What to compare / How listings work" copy. Covered by a new `node test.js` regression test (32 passing).
Remaining from the original order:
5. Ship roadmap guide 1 (seat-count pages) once Search Console shows first impressions (Search Console still needs Jake's sign-in). Defects 6–8 above (guide depth/dates, H1 keyword trade-off, image-weight nits) remain open recommendations.
