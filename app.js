'use strict';
(() => {
  const core = window.ClaironCore;
  const $ = selector => document.querySelector(selector);
  function browserStorage() { try { return window.localStorage; } catch (_) { return { getItem: () => null, setItem: () => { throw new Error('Storage unavailable'); } }; } }
  const storage = browserStorage();
  const state = { offset: 0, filter: 'all', favorites: core.readFavorites(storage), timer: 0, controller: null, favoriteRequest: 0 };
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function renderDate() {
    const date = core.dateAtOffset(new Date(), state.offset);
    $('#date-label').textContent = state.offset === 0 ? `Aujourd’hui · ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}` : date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible');
    clearTimeout(state.timer); state.timer = setTimeout(() => toast.classList.remove('visible'), 2400);
  }
  function saveFavorites() {
    try { storage.setItem(core.FAVORITES_KEY, JSON.stringify(state.favorites)); }
    catch (_) { showToast('Enregistrement indisponible dans ce navigateur.'); }
    $('#favorite-count').textContent = String(state.favorites.length);
  }
  function openSearch(query = '') {
    const dialog = $('#search-dialog');
    if (!dialog.open) dialog.showModal();
    if (query) { $('#search-input').value = query; searchShows(query); }
    else {
      if (state.controller) state.controller.abort();
      $('#search-input').value = ''; $('#search-results').innerHTML = '';
      $('#search-status').textContent = 'Saisissez au moins deux caractères pour chercher.'; $('#search-input').focus();
    }
  }
  function renderSearchResults(shows, out = $('#search-results')) {
    if (!shows.length) { out.innerHTML = ''; return; }
    out.innerHTML = shows.slice(0, 8).map(show => {
      const image = core.safeImageUrl(show.image?.medium || show.image?.original);
      const img = image ? `<img src="${escapeHTML(image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<span class="result-placeholder" aria-hidden="true">c.</span>';
      const summary = core.cleanSummary(show.summary);
      const info = [show.language, ...(Array.isArray(show.genres) ? show.genres.slice(0, 2) : []), show.premiered?.slice(0, 4)].filter(Boolean).join(' · ') || 'Série';
      const isFavorite = state.favorites.includes(show.id);
      return `<article class="result-card">${img}<div class="result-copy"><h3>${escapeHTML(show.name || 'Série sans titre')}</h3><span class="result-meta">${escapeHTML(info)}</span><p>${escapeHTML(summary ? `${summary.slice(0, 170)}${summary.length > 170 ? '…' : ''}` : 'Aucun résumé fourni.')}</p><div class="result-actions"><button type="button" class="favorite-button${isFavorite ? ' saved' : ''}" data-favorite="${show.id}" aria-pressed="${isFavorite}">${isFavorite ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris'}</button>${safeShowUrl(show.url) ? `<a href="${escapeHTML(safeShowUrl(show.url))}" target="_blank" rel="noopener noreferrer">Fiche TVmaze ↗</a>` : ''}</div></div></article>`;
    }).join('');
    out.querySelectorAll('.result-card > img').forEach(image => image.addEventListener('error', () => {
      const placeholder = document.createElement('span'); placeholder.className = 'result-placeholder'; placeholder.setAttribute('aria-hidden', 'true'); placeholder.textContent = 'c.'; image.replaceWith(placeholder);
    }, { once: true }));
    out.querySelectorAll('[data-favorite]').forEach(button => button.addEventListener('click', () => {
      state.favorites = core.toggleFavorite(state.favorites, Number(button.dataset.favorite)); saveFavorites();
      button.classList.toggle('saved', state.favorites.includes(Number(button.dataset.favorite)));
      const saved = state.favorites.includes(Number(button.dataset.favorite)); button.textContent = saved ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris'; button.setAttribute('aria-pressed', String(saved));
      if (out.id === 'catalog-results') { renderCatalogEmpty(); renderFavoriteList(); }
      else { renderCatalogEmpty(); if (state.filter === 'favorites') renderFavoriteList(); }
    }));
  }
  function safeShowUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'www.tvmaze.com' ? url.href : ''; } catch (_) { return ''; }
  }
  async function searchShows(query) {
    const q = query.trim(), status = $('#search-status');
    if (state.controller) state.controller.abort();
    if (q.length < 2) { status.textContent = 'Saisissez au moins deux caractères pour chercher.'; $('#search-results').innerHTML = ''; return; }
    const controller = new AbortController(); state.controller = controller;
    status.textContent = 'Recherche dans le catalogue TVmaze…'; $('#search-results').innerHTML = '';
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (controller.signal.aborted || state.controller !== controller) return;
      if (!Array.isArray(data)) throw new Error('Réponse inattendue');
      const shows = data.map(item => item && item.show).filter(show => show && Number.isInteger(show.id) && show.id > 0);
      if (!shows.length) { status.textContent = 'Aucun résultat. Essayez un autre titre.'; return; }
      status.textContent = `${shows.length} résultat${shows.length > 1 ? 's' : ''} · Catalogue TVmaze, pas un programme TV.`; renderSearchResults(shows);
    } catch (error) {
      if (error.name === 'AbortError') return;
      status.textContent = 'Le catalogue TVmaze est momentanément indisponible. Vérifiez votre connexion puis réessayez.';
    }
  }
  function renderCatalogEmpty() {
    const count = state.favorites.length; $('#favorite-count').textContent = String(count);
    const isFavorites = state.filter === 'favorites';
    $('#catalog-empty-title').textContent = isFavorites ? (count ? 'Vos favoris vous attendent.' : 'Votre liste est encore vide.') : 'Un bon titre en tête ?';
    $('#catalog-empty-copy').textContent = isFavorites ? (count ? 'Les fiches enregistrées sont conservées sur cet appareil.' : 'Ajoutez une série aux favoris depuis les résultats de recherche, et elle apparaîtra ici.') : 'Recherchez une série dans le catalogue public TVmaze. Vos favoris restent enregistrés sur cet appareil.';
    $('#catalog-empty').classList.toggle('favorites-empty', isFavorites);
    $('#catalog-empty').hidden = isFavorites && count > 0;
    $('#catalog-search').hidden = isFavorites;
  }
  async function renderFavoriteList() {
    const request = ++state.favoriteRequest;
    const host = $('#catalog-results'); host.innerHTML = '';
    if (!state.favorites.length) return;
    host.innerHTML = '<p class="favorite-loading">Chargement de vos fiches enregistrées…</p>';
    try {
      const records = await Promise.all(state.favorites.map(async id => {
        const response = await fetch(`https://api.tvmaze.com/shows/${id}`, { headers: { Accept: 'application/json' } });
        if (!response.ok) return null;
        const show = await response.json(); return show && show.id === id ? show : null;
      }));
      if (state.filter !== 'favorites' || request !== state.favoriteRequest) return;
      const shows = core.visibleShows(records.filter(Boolean), state.favorites, 'favorites');
      if (!shows.length) { host.innerHTML = '<p class="favorite-loading">Impossible de charger vos fiches pour le moment. Réessayez plus tard.</p>'; return; }
      renderSearchResults(shows, host);
    } catch (_) {
      if (state.filter === 'favorites' && request === state.favoriteRequest) host.innerHTML = '<p class="favorite-loading">Impossible de charger vos fiches pour le moment. Vérifiez votre connexion.</p>';
    }
  }
  function setFilter(filter) {
    state.filter = filter; state.favoriteRequest++;
    document.querySelectorAll('.filter-button').forEach(button => { const active = button.dataset.filter === filter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    renderCatalogEmpty(); $('#catalog-results').innerHTML = '';
    if (filter === 'favorites') renderFavoriteList();
  }
  $('#prev-day').addEventListener('click', () => { state.offset--; renderDate(); });
  $('#next-day').addEventListener('click', () => { state.offset++; renderDate(); });
  $('#today-button').addEventListener('click', () => { state.offset = 0; renderDate(); });
  $('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next;
    try { storage.setItem(core.THEME_KEY, next); } catch (_) { /* theme still works for this session */ }
    $('#theme-toggle').setAttribute('aria-label', next === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
    document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#171a19' : '#f7f6f2';
  });
  try { const theme = storage.getItem(core.THEME_KEY); if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme; } catch (_) { /* use the default theme */ }
  $('#theme-toggle').setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
  document.querySelector('meta[name="theme-color"]').content = document.documentElement.dataset.theme === 'dark' ? '#171a19' : '#f7f6f2';
  ['#search-open', '#search-open-secondary', '#catalog-search'].forEach(selector => $(selector).addEventListener('click', () => openSearch()));
  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  $('#search-input').addEventListener('input', event => { clearTimeout(state.timer); state.timer = setTimeout(() => searchShows(event.target.value), 300); });
  $('#dialog-close').addEventListener('click', () => $('#search-dialog').close());
  $('#search-dialog').addEventListener('click', event => { if (event.target === $('#search-dialog')) $('#search-dialog').close(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape' && $('#search-dialog').open && state.controller) state.controller.abort();
  });
  renderDate(); setFilter('all'); $('#favorite-count').textContent = String(state.favorites.length);
})();
