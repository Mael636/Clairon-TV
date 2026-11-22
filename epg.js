'use strict';
/* Clairon EPG adapter boundary. This module contains no listings and enables no provider by default. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ClaironEpg = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const MAX_WINDOW_DAYS = 14;
  const clean = value => typeof value === 'string' ? value.trim() : '';
  function parseInstant(value) {
    if (typeof value !== 'string' || !/(Z|[+-]\d{2}:?\d{2})$/i.test(value)) return NaN;
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : NaN;
  }
  function normalize(payload, { from, to, channelOrder = [] } = {}) {
    const startWindow = from == null ? -Infinity : parseInstant(from);
    const endWindow = to == null ? Infinity : parseInstant(to);
    if (Number.isNaN(startWindow) || Number.isNaN(endWindow) || startWindow >= endWindow) throw new TypeError('Fenêtre EPG invalide; dates ISO avec fuseau requises.');
    if (Number.isFinite(startWindow) && Number.isFinite(endWindow) && endWindow - startWindow > MAX_WINDOW_DAYS * 86400000) throw new RangeError('Fenêtre EPG limitée à 14 jours.');
    if (!payload || !Array.isArray(payload.channels) || !Array.isArray(payload.programmes)) throw new TypeError('Réponse EPG invalide.');
    const known = new Map();
    payload.channels.forEach((channel, index) => {
      if (!channel || typeof channel.id !== 'string' || !clean(channel.name) || known.has(channel.id)) return;
      known.set(channel.id, { id: channel.id, name: clean(channel.name), number: Number.isFinite(channel.number) ? channel.number : index + 1, logo: safeHttps(channel.logo), sourceUrl: safeHttps(channel.sourceUrl) });
    });
    const channelRank = new Map(channelOrder.map((id, index) => [id, index]));
    const channels = [...known.values()].sort((a, b) => (channelRank.get(a.id) ?? Infinity) - (channelRank.get(b.id) ?? Infinity) || a.number - b.number || a.name.localeCompare(b.name, 'fr'));
    const programmes = payload.programmes.flatMap(item => {
      if (!item || !known.has(item.channelId)) return [];
      const start = parseInstant(item.start), end = parseInstant(item.end);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || end <= startWindow || start >= endWindow) return [];
      const title = clean(item.title);
      if (!title) return [];
      return [{ channelId: item.channelId, title, start: new Date(start).toISOString(), end: new Date(end).toISOString(), synopsis: clean(item.synopsis), category: clean(item.category), episode: clean(item.episode), image: safeHttps(item.image), sourceUrl: safeHttps(item.sourceUrl), trailerUrl: safeHttps(item.trailerUrl) }];
    }).sort((a, b) => a.start.localeCompare(b.start) || (channelRank.get(a.channelId) ?? Infinity) - (channelRank.get(b.channelId) ?? Infinity));
    return { channels, programmes };
  }
  function safeHttps(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch (_) { return ''; }
  }
  function atTime(data, instant = new Date()) {
    const now = typeof instant === 'number' ? instant : instant.getTime();
    const byChannel = new Map();
    for (const program of data.programmes) {
      const list = byChannel.get(program.channelId) || []; list.push(program); byChannel.set(program.channelId, list);
    }
    return data.channels.map(channel => {
      const list = (byChannel.get(channel.id) || []).slice().sort((a, b) => a.start.localeCompare(b.start));
      const currentIndex = list.findIndex(p => Date.parse(p.start) <= now && now < Date.parse(p.end));
      return { channel, current: currentIndex < 0 ? null : list[currentIndex], next: currentIndex < 0 ? (list.find(p => Date.parse(p.start) > now) || null) : (list[currentIndex + 1] || null) };
    });
  }
  async function load(config, { fetchImpl = globalThis.fetch, signal } = {}) {
    if (!config || config.enabled !== true || config.rightsConfirmed !== true) return { status: 'disabled', data: { channels: [], programmes: [] } };
    let endpoint;
    try { endpoint = new URL(config.endpoint); } catch (_) { throw new TypeError('Endpoint EPG invalide.'); }
    if (endpoint.protocol !== 'https:') throw new TypeError('L’EPG doit être fourni en HTTPS.');
    if (typeof fetchImpl !== 'function') throw new TypeError('Fetch indisponible.');
    const response = await fetchImpl(endpoint.href, { signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Source EPG indisponible (HTTP ${response.status}).`);
    const body = await response.json();
    return { status: 'ready', data: normalize(body, config.window || {}) };
  }
  return { normalize, atTime, load, safeHttps, MAX_WINDOW_DAYS };
});
