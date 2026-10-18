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
  var LOOPS_SIZE_CHART_LIST_ID = 'cmvecnjcxy14j0jx75stg0p3o';
  var LOOPS_SUCCESS = 'You are in. Watch for The Conference Room Brief in your inbox.';
  var LOOPS_ERROR = 'Something went wrong and your signup was not completed. Your email address is still above — please try again.';
  function loopsBody(email, mailingLists) {
    var body = new URLSearchParams();
    body.set('email', String(email || '').trim());
    body.set('mailingLists', String(mailingLists || LOOPS_LIST_ID));
    return body.toString();
  }
  var LOOPS_ENDPOINT = 'https://app.loops.so/api/newsletter-form/cmvd16xke0cm20jsmvf2l6884';
  function lsGet(k) { try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (err) { return null; } }
  function lsSet(k, v) { try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (err) {} }
  function ssGet(k) { try { return window.sessionStorage ? window.sessionStorage.getItem(k) : null; } catch (err) { return null; } }
  function ssSet(k, v) { try { if (window.sessionStorage) window.sessionStorage.setItem(k, v); } catch (err) {} }
  var EXIT_SUPPRESS_MS = 30 * 24 * 60 * 60 * 1000;
  function markSubscribed() { lsSet('tablesizer_subscribed', '1'); lsSet('tablesizer_exit_suppressed_until', String(Date.now() + EXIT_SUPPRESS_MS)); }
  // Last line of defence at the submission source: if a hidden plan field
  // still holds a raw machine size (e.g. a browser cached the pre-fix app.js
  // while loading this file fresh), convert inches to the planner's friendly
  // feet/inches display before anything is posted to Loops.
  function friendlySize(value) {
    var s = String(value || '').trim();
    var m = s.match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)in$/i);
    if (!m) return s;
    function fmtIn(inches) { var total = Math.round(+inches), ft = Math.floor(total / 12), rem = total % 12; return ft ? (ft + '\u2032' + (rem ? ' ' + rem + '\u2033' : '')) : (rem + '\u2033'); }
    return fmtIn(m[1]) + ' \u00d7 ' + fmtIn(m[2]);
  }
  function buildPlanBody(fields) {
    fields = fields || {};
    var body = new URLSearchParams();
    body.set('email', String(fields.email || '').trim());
    body.set('firstName', String(fields.firstName || '').trim());
    body.set('tableSize', friendlySize(fields.tableSize));
    body.set('seats', String(fields.seats == null ? '' : fields.seats));
    body.set('shape', String(fields.shape || ''));
    body.set('roomSize', friendlySize(fields.roomSize));
    body.set('planUrl', String(fields.planUrl || ''));
    // Every plan save joins Size Chart Requests. The TableSizer list is
    // added (second, comma-separated) only on explicit opt-in.
    body.set('mailingLists', fields.optIn ? (LOOPS_SIZE_CHART_LIST_ID + ',' + LOOPS_LIST_ID) : LOOPS_SIZE_CHART_LIST_ID);
    return body.toString();
  }
  function loopsPost(action, bodyString) {
    return window.fetch(action || LOOPS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyString
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = JSON.parse(text); } catch (ignore) {}
        if (res.status === 429) throw new Error('Too many signups right now — please try again in a little while.');
        if (!res.ok || (data && data.success === false)) throw new Error(data && data.message ? String(data.message) : 'Something went wrong — please try again.');
        return data;
      });
    });
  }
  window.TABLESIZER_LOOPS = { endpoint: LOOPS_ENDPOINT, mailingListId: LOOPS_LIST_ID, sizeChartListId: LOOPS_SIZE_CHART_LIST_ID, successCopy: LOOPS_SUCCESS, errorCopy: LOOPS_ERROR, buildBody: loopsBody, buildPlanBody: buildPlanBody, friendlySize: friendlySize, post: loopsPost, markSubscribed: markSubscribed };
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
        markSubscribed();
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
  // Save-my-chart forms (inline card + exit pop share this handler via .save-form).
  var PLAN_ERROR = 'Something went wrong and your size chart was not sent. Your details are still here — please try again.';
  document.querySelectorAll('form.save-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      window.tsTrack('plan_email_click', {});
      if (!window.fetch || !window.URLSearchParams) return; // native fallback posts the form fields
      e.preventDefault();
      if (f.getAttribute('data-sending') === '1') return;
      function field(name) { var el = f.querySelector('[name="' + name + '"]'); return el ? el.value : ''; }
      var optInEl = f.querySelector('[name="briefOptIn"]');
      var button = f.querySelector('button[type="submit"],button');
      var originalLabel = button ? button.textContent : '';
      var sizeLabel = f.getAttribute('data-size-label') || field('tableSize');
      var err = f.querySelector('.save-error');
      if (!err) { err = document.createElement('p'); err.className = 'save-error'; err.setAttribute('role', 'alert'); f.appendChild(err); }
      err.textContent = ''; err.hidden = true;
      f.setAttribute('data-sending', '1');
      if (button) { button.disabled = true; button.textContent = 'Sending'; }
      loopsPost(f.getAttribute('action'), buildPlanBody({
        email: field('email'), firstName: field('firstName'), tableSize: field('tableSize'),
        seats: field('seats'), shape: field('shape'), roomSize: field('roomSize'),
        planUrl: field('planUrl'), optIn: !!(optInEl && optInEl.checked)
      })).then(function () {
        markSubscribed();
        var el = document.createElement('p');
        el.className = 'save-done'; el.setAttribute('role', 'status');
        el.textContent = 'Check your inbox. Your ' + (sizeLabel || 'size') + ' chart is on its way.';
        f.replaceWith(el);
      }).catch(function (error) {
        // Keep every typed value: only the error line and button state change.
        f.removeAttribute('data-sending');
        if (button) { button.disabled = false; button.textContent = originalLabel; }
        err.textContent = (error && error.message) || PLAN_ERROR; err.hidden = false;
      });
    });
  });
  // Exit pop: once per session, suppressed 30 days after close/success,
  // never for subscribed visitors, never while a save-card field has focus.
  function exitShouldShow(o) {
    return !!(o && o.interacted && !o.subscribed && !o.shownThisSession && !o.inputFocused && !o.open && (!o.suppressedUntil || +o.suppressedUntil <= o.now));
  }
  window.TABLESIZER_EXIT = { suppressMs: EXIT_SUPPRESS_MS, shouldShow: exitShouldShow };
  var pop = document.querySelector ? document.querySelector('#exitPop') : null;
  if (pop) {
    var exitOpened = false, exitInteracted = false, lastFocus = null, mobileArmed = false;
    function saveInputFocused() {
      var a = document.activeElement;
      return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT') && a.closest && a.closest('.save-form'));
    }
    function exitState() {
      return { interacted: exitInteracted, subscribed: !!lsGet('tablesizer_subscribed'), shownThisSession: !!ssGet('tablesizer_exit_shown'), inputFocused: saveInputFocused(), open: exitOpened, suppressedUntil: +lsGet('tablesizer_exit_suppressed_until') || 0, now: Date.now() };
    }
    function openExit() {
      if (!exitShouldShow(exitState())) return false;
      exitOpened = true; ssSet('tablesizer_exit_shown', '1'); lastFocus = document.activeElement || null;
      pop.hidden = false;
      var email = pop.querySelector('form.save-form [name="email"]');
      if (email && email.focus) email.focus();
      return true;
    }
    function closeExit() {
      if (!exitOpened) return;
      exitOpened = false; pop.hidden = true;
      lsSet('tablesizer_exit_suppressed_until', String(Date.now() + EXIT_SUPPRESS_MS));
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    window.TABLESIZER_EXIT.open = openExit; window.TABLESIZER_EXIT.close = closeExit;
    pop.querySelectorAll('[data-exit-close]').forEach(function (el) { el.addEventListener('click', closeExit); });
    document.addEventListener('keydown', function (e) { if (exitOpened && (e.key === 'Escape' || e.key === 'Esc')) closeExit(); });
    function mobileLikely() { return !!((window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || window.innerWidth <= 760); }
    function onScroll() {
      var d = document.documentElement, max = (d.scrollHeight || 0) - window.innerHeight;
      if (max > 0 && (window.scrollY || d.scrollTop || 0) / max >= 0.75) openExit();
    }
    function armMobile() {
      if (mobileArmed || !mobileLikely()) return; mobileArmed = true;
      setTimeout(openExit, 60000);
      document.addEventListener('scroll', onScroll, { passive: true });
    }
    function markInteracted(e) {
      var t = e.target;
      if (!t || !t.closest || !t.closest('#planner') || t.closest('.save-form') || t.closest('#exitPop')) return;
      if (!exitInteracted) { exitInteracted = true; armMobile(); }
    }
    document.addEventListener('input', markInteracted, true);
    document.addEventListener('click', markInteracted, true);
    document.addEventListener('mouseout', function (e) {
      if (mobileLikely() || e.relatedTarget || e.clientY > 8) return;
      openExit();
    });
  }
})(window.TABLESIZER_ANALYTICS);
