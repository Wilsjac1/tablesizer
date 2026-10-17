/* TableSizer analytics — privacy-friendly, cookieless, OFF until Jake pastes a token.
   See ANALYTICS.md. Supported: GoatCounter (recommended for custom events) or Cloudflare Web Analytics (pageviews only).
   1) Create the free account (Jake only). 2) Paste ONE value below. 3) Redeploy. No cookies are set by this code. */
window.TABLESIZER_ANALYTICS = { provider: '', goatCounterCode: '', cloudflareToken: '' };
(function (cfg) {
  window.__tsEvents = [];
  window.tsTrack = function (name, data) {
    var payload = { event: name, data: data || {}, page: location.pathname, ts: new Date().toISOString() };
    window.__tsEvents.push(payload);
    if (cfg.provider === 'goatcounter' && window.goatcounter && window.goatcounter.count)
      window.goatcounter.count({ path: 'event/' + name, title: name, event: true });
  };
  if (cfg.provider === 'goatcounter' && cfg.goatCounterCode) {
    var g = document.createElement('script'); g.async = true; g.src = '//gc.zgo.at/count.js';
    g.setAttribute('data-goatcounter', 'https://' + cfg.goatCounterCode + '.goatcounter.com/count'); document.head.appendChild(g);
  } else if (cfg.provider === 'cloudflare' && cfg.cloudflareToken) {
    var c = document.createElement('script'); c.defer = true; c.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    c.setAttribute('data-cf-beacon', JSON.stringify({ token: cfg.cloudflareToken })); document.head.appendChild(c);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="fargowoodworks.com"]');
    if (a) window.tsTrack('quote_click', { href: a.getAttribute('href') });
  });
  document.querySelectorAll('form.nl').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); window.tsTrack('newsletter_click', {});
      f.outerHTML = '<p class="note">Thank you. The newsletter launches soon; nothing has been sent yet.</p>'; });
  });
})(window.TABLESIZER_ANALYTICS);
