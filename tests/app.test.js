'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../core.js');

class Element {
  constructor(id = '') { this.id = id; this.textContent = ''; this.innerHTML = ''; this.hidden = false; this.open = false; this.value = ''; this.dataset = {}; this.attributes = {}; this.listeners = {}; this.classList = { add() {}, toggle() {}, remove() {} }; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  setAttribute(name, value) { this.attributes[name] = value; }
  focus() {}
  showModal() { this.open = true; }
  close() { this.open = false; }
  querySelectorAll() { return []; }
}

function launchApp() {
  const ids = ['date-label', 'toast', 'favorite-count', 'search-dialog', 'search-input', 'search-status', 'search-results', 'catalog-empty-title', 'catalog-empty-copy', 'catalog-empty', 'catalog-search', 'catalog-results', 'prev-day', 'next-day', 'today-button', 'theme-toggle', 'search-open', 'search-open-secondary', 'dialog-close'];
  const elements = Object.fromEntries(ids.map(id => [id, new Element(id)]));
  const html = { dataset: { theme: 'light' } };
  const meta = { content: '' };
  const filterButtons = ['all', 'favorites'].map(filter => { const el = new Element(); el.dataset.filter = filter; return el; });
  const document = {
    documentElement: html,
    activeElement: { tagName: 'BODY' },
    querySelector(selector) { if (selector.startsWith('#')) return elements[selector.slice(1)]; if (selector === 'meta[name="theme-color"]') return meta; return null; },
    querySelectorAll(selector) { return selector === '.filter-button' ? filterButtons : []; },
    addEventListener() {}
  };
  const store = new Map();
  const localStorage = { getItem(key) { return store.get(key) || null; }, setItem(key, value) { store.set(key, value); } };
  const window = { ClaironCore: core, localStorage };
  const context = { window, document, localStorage, URL, Date, setTimeout, clearTimeout, AbortController, fetch: async () => { throw new Error('network disabled in test'); } };
  vm.runInNewContext(fs.readFileSync(require.resolve('../app.js'), 'utf8'), context);
  return { elements, filterButtons, html, meta };
}

test('app starts with an explicit empty EPG state, date navigation, and usable filter semantics', () => {
  const { elements, filterButtons } = launchApp();
  assert.match(elements['catalog-empty-copy'].textContent, /TVmaze/);
  assert.equal(elements['favorite-count'].textContent, '0');
  assert.equal(filterButtons[0].attributes['aria-pressed'], 'true');
  assert.equal(elements['date-label'].textContent.length > 0, true);
  assert.equal(elements['catalog-results'].innerHTML, '');
  assert.equal(typeof elements['prev-day'].listeners.click, 'function');
});

test('app theme toggle persists locally and updates browser theme color', () => {
  const { elements, html, meta } = launchApp();
  elements['theme-toggle'].listeners.click();
  assert.equal(html.dataset.theme, 'dark');
  assert.equal(meta.content, '#171a19');
  assert.equal(elements['theme-toggle'].attributes['aria-label'], 'Activer le thème clair');
});
