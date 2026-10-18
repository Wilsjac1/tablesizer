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
  // Newsletter: AJAX POST to Loops so visitors stay on TableSizer. The plain
  // native form in build.js remains the no-JS fallback: this handler only calls
  // preventDefault when fetch + URLSearchParams are available.
  // Loops custom-form contract (docs.forms/custom-form): POST the form endpoint
  // as application/x-www-form-urlencoded with `email` and `mailingLists`
  // (comma-separated list IDs; lists must be Public to join via a form).
  var LOOPS_LIST_ID = 'cmvd1ree84j3i0jvtad881iqp';
  var LOOPS_SUCCESS = 'You are in. Watch for The Conference Room Brief in your inbox.';
  var LOOPS_ERROR = 'Something went wrong and your signup was not completed. Your email address is still above — please try again.';
  function loopsBody(email, mailingLists) {
    var body = new URLSearchParams();
    body.set('email', String(email || '').trim());
    body.set('mailingLists', String(mailingLists || LOOPS_LIST_ID));
    return body.toString();
  }
  window.TABLESIZER_LOOPS = { mailingListId: LOOPS_LIST_ID, successCopy: LOOPS_SUCCESS, errorCopy: LOOPS_ERROR, buildBody: loopsBody };
  document.querySelectorAll('form.nl').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      window.tsTrack('newsletter_click', {});
      if (!window.fetch || !window.URLSearchParams) return; // no-JS / legacy: native POST fallback
      e.preventDefault();
      if (f.getAttribute('data-sending') === '1') return;
      var emailInput = f.querySelector('input[name="email"]');
      var listInput = f.querySelector('input[name="mailingLists"]');
      var button = f.querySelector('button');
      var oldError = f.parentNode && f.parentNode.querySelector ? f.parentNode.querySelector('.nl-error') : null;
      if (oldError) oldError.remove();
      var originalLabel = button ? button.textContent : '';
      f.setAttribute('data-sending', '1');
      if (button) { button.disabled = true; button.textContent = 'Subscribing'; }
      function fail(message) {
        f.removeAttribute('data-sending');
        if (button) { button.disabled = false; button.textContent = originalLabel; }
        // Form and typed email are left untouched, so the signup is not lost.
        var err = document.createElement('p');
        err.className = 'nl-error'; err.setAttribute('role', 'alert'); err.textContent = message || LOOPS_ERROR;
        f.after(err);
        if (emailInput && emailInput.focus) emailInput.focus();
      }
      function done() {
        var el = document.createElement('p');
        el.className = 'nl-done'; el.setAttribute('role', 'status'); el.textContent = LOOPS_SUCCESS;
        f.replaceWith(el);
      }
      window.fetch(f.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loopsBody(emailInput ? emailInput.value : '', listInput ? listInput.value : LOOPS_LIST_ID)
      }).then(function (res) {
        // Endpoint may answer JSON, a redirect target, or a bare body: any 2xx is success.
        return res.text().then(function (text) {
          var data = null;
          try { data = JSON.parse(text); } catch (ignore) {}
          if (res.status === 429) { fail('Too many signups right now. Your email address is still above — please try again in a little while.'); return; }
          if (!res.ok || (data && data.success === false)) { fail(data && data.message ? String(data.message) : LOOPS_ERROR); return; }
          done();
        });
      }).catch(function () { fail(); });
    });
  });
})(window.TABLESIZER_ANALYTICS);
