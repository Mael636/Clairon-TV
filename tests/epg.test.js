'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const epg = require('../epg.js');
const feed = { channels: [{id:'b',name:'Deux',number:2},{id:'a',name:'Un',number:1}], programmes: [
  {channelId:'a',title:'Actuel',start:'2026-11-22T12:00:00+01:00',end:'2026-11-22T13:00:00+01:00',synopsis:'Résumé',trailerUrl:'https://video.example/trailer'},
  {channelId:'a',title:'Après',start:'2026-11-22T13:00:00+01:00',end:'2026-11-22T14:00:00+01:00'},
  {channelId:'ghost',title:'Orphelin',start:'2026-11-22T12:00:00Z',end:'2026-11-22T13:00:00Z'},
  {channelId:'b',title:'Mauvais horaire',start:'2026-11-22T15:00',end:'2026-11-22T14:00Z'}
] };
test('normalise les données, conserve l’ordre explicite et écarte les enregistrements invalides', () => {
  const out = epg.normalize(feed, { channelOrder:['a','b'], from:'2026-11-22T11:00:00Z', to:'2026-11-22T16:00:00Z' });
  assert.deepEqual(out.channels.map(c => c.id), ['a','b']); assert.equal(out.programmes.length, 2);
  assert.equal(out.programmes[0].trailerUrl, 'https://video.example/trailer');
});
test('calcule direct et prochain programme, sans inventer les absences', () => {
  const data = epg.normalize(feed, { channelOrder:['a','b'] });
  const rows = epg.atTime(data, new Date('2026-11-22T11:30:00Z'));
  assert.equal(rows[0].current.title, 'Actuel'); assert.equal(rows[0].next.title, 'Après');
  assert.equal(rows[1].current, null); assert.equal(rows[1].next, null);
});
test('refuse par défaut et n’appelle aucun fournisseur sans droits confirmés', async () => {
  let called = false; const result = await epg.load({ enabled:true, rightsConfirmed:false, endpoint:'https://example.org/epg' }, { fetchImpl:async()=>{called=true;} });
  assert.equal(result.status, 'disabled'); assert.equal(called, false);
});
test('échec source propagé au contrôleur et URL non-HTTPS exclue', async () => {
  await assert.rejects(epg.load({ enabled:true, rightsConfirmed:true, endpoint:'https://example.org/epg' }, { fetchImpl:async()=>({ok:false,status:503}) }), /HTTP 503/);
  assert.equal(epg.safeHttps('http://example.org/logo'), '');
});
test('rejette fenêtre sans fuseau et fenêtre excessive', () => {
  assert.throws(() => epg.normalize(feed, {from:'2026-11-22T12:00',to:'2026-11-23T12:00Z'}), /fuseau/);
  assert.throws(() => epg.normalize(feed, {from:'2026-11-01T00:00:00Z',to:'2026-11-20T00:00:00Z'}), /14 jours/);
});
