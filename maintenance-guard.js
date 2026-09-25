(function () {
  'use strict';

  var CONFIG_URL = 'maintenance-config.json';
  var MAINTENANCE_PAGE = 'maintenance.html';
  var BYPASS_KEY = 'formula_maintenance_bypass';
  var CACHE_TTL = 30000;

  var isLocalhost = (
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '' ||
    location.protocol === 'file:'
  );

  var currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isMaintenancePage = currentPage === MAINTENANCE_PAGE.toLowerCase();

  var urlParams = new URLSearchParams(location.search);
  var urlBypass = urlParams.get('bypass');

  var storedBypass = null;
  try { storedBypass = localStorage.getItem(BYPASS_KEY); } catch (e) {}

  var lastFetch = 0;
  var cachedConfig = null;

  function fetchConfig(cb) {
    var now = Date.now();
    if (cachedConfig && (now - lastFetch) < CACHE_TTL) { cb(cachedConfig); return; }
    fetch(CONFIG_URL + '?t=' + now, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (c) { cachedConfig = c; lastFetch = now; cb(c); })
      .catch(function () { cb({ enabled: false }); });
  }

  function check(cfg) {
    if (!cfg || !cfg.enabled) return;
    if (isLocalhost && cfg.allowLocalhost) return;
    if (isMaintenancePage) return;

    var allow = (cfg.allowPaths || []).map(function (p) { return p.toLowerCase(); });
    if (allow.indexOf(currentPage) !== -1) return;

    if (urlBypass && urlBypass === cfg.bypassKey) {
      try { localStorage.setItem(BYPASS_KEY, cfg.bypassKey); } catch (e) {}
      return;
    }
    if (storedBypass && storedBypass === cfg.bypassKey) return;

    var target = MAINTENANCE_PAGE;
    if (location.pathname && location.pathname !== '/') {
      target += '?from=' + encodeURIComponent(location.pathname + location.search);
    }
    location.replace(target);
  }

  fetchConfig(check);
  setInterval(function () { fetchConfig(check); }, 60000);
})();