# Analytics & Search Console — what Jake needs to do (no accounts created by the agent)

## Analytics — STATUS (Oct 16, 2026)
**Done:** GoatCounter account created by Jake (site code `tablesizer`, https://tablesizer.goatcounter.com, account email Jake@fargowoodworks.com). `site.js` is configured with `provider: 'goatcounter', goatCounterCode: 'tablesizer'` and the snippet is live on tablesizer.com.
**Pending (Jake only):** GoatCounter email verification for Jake@fargowoodworks.com — click the verification link in that inbox. Until verified, some account features may be limited; pageview counting does not depend on this code change.

Code is in `site.js` (`window.TABLESIZER_ANALYTICS`, top of file). No cookies are set by our code.

### Recommended: GoatCounter (free, cookieless, supports the custom events)
1. Go to https://www.goatcounter.com and create a free account / site (e.g. `tablesizer`).
2. In `/workspace/table-planner/site.js`, set:
   `provider: 'goatcounter', goatCounterCode: '<your code>'` (the subdomain part before `.goatcounter.com`).
3. Commit + push. Events already wired: `planner_used` (debounced, with shape/seats/room), `quote_click` (any fargowoodworks.com link), `newsletter_click`, `plan_download`. They appear in GoatCounter as event paths `event/<name>` and are also queued in `window.__tsEvents` for debugging.

### Alternative: Cloudflare Web Analytics (free, pageviews; custom events are limited)
1. Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site (`tablesizer.com`) → copy the token.
2. In `site.js` set `provider: 'cloudflare', cloudflareToken: '<token>'`. Commit + push.

Do not enable both. Verify after deploy in the provider dashboard (real-time/pageviews) and by clicking the quote button once.

## Google Search Console (blocked on Jake's Google account — do not sign in as Jake)

**Prepared and verified by the agent:** `https://tablesizer.com/sitemap.xml` is reachable and lists all pages; `robots.txt` references it. Nothing else can be done without Jake's Google sign-in: Google issues the verification token only inside his account.

**Jake's 3 clicks (about 5 minutes):**
1. Go to https://search.google.com/search-console (signed in as Jake) → Add property → Domain → `tablesizer.com`.
2. Copy the TXT verification record Google shows, add it at Namecheap (tablesizer.com → Advanced DNS → TXT Record, host `@`, paste value), then click Verify in Search Console. (We can add this record for you as soon as you paste us the value — it cannot be generated in advance.)
3. In Search Console → Sitemaps, submit `https://tablesizer.com/sitemap.xml`, then use URL Inspection → Request Indexing for `/`, `/reception-desk-dimensions.html` and `/conference-room-layout-guide.html`.

The fuller walkthrough follows.
1. Go to https://search.google.com/search-console with the Google account that should own TableSizer.
2. Add property → Domain → `tablesizer.com` (preferred; covers www/non-www and http/https) — or URL-prefix `https://tablesizer.com/` if DNS access is unavailable.
3. Verify: for Domain, add the TXT record Google gives you at Namecheap (Advanced DNS → TXT @). For URL-prefix, the HTML-file or Google Analytics methods also work.
4. Submit sitemap: Sitemaps → `https://tablesizer.com/sitemap.xml`.
5. Use URL Inspection on `/`, `/conference-table-size-chart.html`, `/reception-desk-dimensions.html` and `/conference-room-layout-guide.html`, then Request Indexing.
6. After a few days check Coverage/Pages and Performance; no paid service is required.
