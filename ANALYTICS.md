# Analytics & Search Console — what Jake needs to do (no accounts created by the agent)

## Analytics (blocked on Jake creating ONE free account)
Code is already installed in `site.js` (`window.TABLESIZER_ANALYTICS`, top of file). It is inert until a token is pasted. No cookies are set by our code.

### Recommended: GoatCounter (free, cookieless, supports the custom events)
1. Go to https://www.goatcounter.com and create a free account / site (e.g. `tablesizer`).
2. In `/workspace/table-planner/site.js`, set:
   `provider: 'goatcounter', goatCounterCode: '<your code>'` (the subdomain part before `.goatcounter.com`).
3. Commit + push. Events already wired: `planner_used` (debounced, with shape/seats/room), `quote_click` (any fargowoodworks.com link), `newsletter_click`, `plan_download`. They appear in GoatCounter as event paths `event/<name>` and are also queued in `window.__tsEvents` for debugging.

### Alternative: Cloudflare Web Analytics (free, pageviews; custom events are limited)
1. Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site (`tablesizer.com`) → copy the token.
2. In `site.js` set `provider: 'cloudflare', cloudflareToken: '<token>'`. Commit + push.

Do not enable both. Verify after deploy in the provider dashboard (real-time/pageviews) and by clicking the quote button once.

## Google Search Console (blocked on Jake's Google account)
1. Go to https://search.google.com/search-console with the Google account that should own TableSizer.
2. Add property → Domain → `tablesizer.com` (preferred; covers www/non-www and http/https) — or URL-prefix `https://tablesizer.com/` if DNS access is unavailable.
3. Verify: for Domain, add the TXT record Google gives you at Namecheap (Advanced DNS → TXT @). For URL-prefix, the HTML-file or Google Analytics methods also work.
4. Submit sitemap: Sitemaps → `https://tablesizer.com/sitemap.xml`.
5. Use URL Inspection on `/`, `/conference-table-size-chart.html`, `/reception-desk-dimensions.html` and `/conference-room-layout-guide.html`, then Request Indexing.
6. After a few days check Coverage/Pages and Performance; no paid service is required.
