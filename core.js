'use strict';
(function (root) {
  const FAVORITES_KEY = 'clairon-favorites-v2';
  const THEME_KEY = 'clairon-theme';
  function readFavorites(storage) {
    try {
      const parsed = JSON.parse(storage.getItem(FAVORITES_KEY) || '[]');
      return Array.isArray(parsed) ? [...new Set(parsed.filter(x => typeof x === 'number' && Number.isInteger(x) && x > 0))] : [];
    } catch (_) { return []; }
  }
  function toggleFavorite(ids, id) {
    if (!Number.isInteger(id) || id <= 0) return [...ids];
    return ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
  }
  function cleanSummary(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, ' ').trim();
  }
  function visibleShows(shows, favoriteIds, filter) {
    return shows.filter(show => filter !== 'favorites' || favoriteIds.includes(show.id));
  }
  function dateAtOffset(now, offset) {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    return date;
  }
  function safeImageUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; }
    catch (_) { return ''; }
  }
  const api = { FAVORITES_KEY, THEME_KEY, readFavorites, toggleFavorite, cleanSummary, visibleShows, dateAtOffset, safeImageUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ClaironCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
