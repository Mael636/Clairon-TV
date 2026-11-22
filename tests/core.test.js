'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core.js');

function storageWith(value) {
  return { getItem(key) { return key === core.FAVORITES_KEY ? value : null; } };
}

test('favorites storage ignores malformed, duplicate, and invalid ids', () => {
  assert.deepEqual(core.readFavorites(storageWith('[4,4,-2,"3",0,9]')), [4, 9]);
  assert.deepEqual(core.readFavorites(storageWith('not json')), []);
  assert.deepEqual(core.readFavorites(storageWith('{"id":4}')), []);
});

test('favorite toggle adds and removes a valid show id', () => {
  assert.deepEqual(core.toggleFavorite([2], 7), [2, 7]);
  assert.deepEqual(core.toggleFavorite([2, 7], 7), [2]);
  assert.deepEqual(core.toggleFavorite([2], -1), [2]);
});

test('favorites filter never fabricates data', () => {
  const shows = [{ id: 2, name: 'Catalogue A' }, { id: 3, name: 'Catalogue B' }];
  assert.deepEqual(core.visibleShows(shows, [3], 'favorites'), [shows[1]]);
  assert.deepEqual(core.visibleShows([], [3], 'favorites'), []);
  assert.deepEqual(core.visibleShows(shows, [], 'all'), shows);
});

test('catalogue summary markup is reduced to plain text', () => {
  assert.equal(core.cleanSummary('<p>Un &amp; <b>deux</b></p>'), 'Un & deux');
  assert.equal(core.cleanSummary(null), '');
});

test('only HTTPS image URLs are accepted', () => {
  assert.equal(core.safeImageUrl('https://static.tvmaze.com/poster.jpg'), 'https://static.tvmaze.com/poster.jpg');
  assert.equal(core.safeImageUrl('http://example.org/image'), '');
  assert.equal(core.safeImageUrl('javascript:alert(1)'), '');
});

test('date navigation returns the selected local calendar day', () => {
  const date = core.dateAtOffset(new Date(2026, 10, 22, 12), 2);
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 10);
  assert.equal(date.getDate(), 24);
});
