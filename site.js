/* TableSizer analytics — privacy-friendly, cookieless. GoatCounter pageviews come from the standard static snippet in each page <head> (build.js). This file only bridges custom events (planner_used, quote_click, newsletter_click, plan_download) to window.goatcounter.count(). See ANALYTICS.md. */
window.TABLESIZER_ANALYTICS = { provider: 'goatcounter', goatCounterCode: 'tablesizer', cloudflareToken: '' };
(function (cfg) {
  window.__tsEvents = [];
  window.tsTrack = function (name, data) {
    var payload = { event: name, data: data || {}, page: location.pathname, ts: new Date().toISOString() };
    window.__tsEvents.push(payload);
    if (cfg.provider === 'goatcounter') {
      var tries = 0;
      (function send() {
        if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'event/' + name, title: name, event: true });
        else if (++tries < 20) setTimeout(send, 500);
      })();
    }
  };
  if (cfg.provider === 'cloudflare' && cfg.cloudflareToken) {
    var c = document.createElement('script'); c.defer = true; c.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    c.setAttribute('data-cf-beacon', JSON.stringify({ token: cfg.cloudflareToken })); document.head.appendChild(c);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="fargowoodworks.com"]');
    if (a) window.tsTrack('quote_click', { href: a.getAttribute('href') });
  });
  // Newsletter: native POST to Kit (no preventDefault — the browser submits to app.kit.com).
  document.querySelectorAll('form.nl').forEach(function (f) {
    f.addEventListener('submit', function () { window.tsTrack('newsletter_click', {}); });
  });
})(window.TABLESIZER_ANALYTICS);
