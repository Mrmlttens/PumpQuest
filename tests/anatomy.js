const assert=require('assert');
global.window={};require('../anatomy.js');const a=window.PQ_ANATOMY;const now=Date.parse('2026-11-02T16:00:00Z');
const exercise=id=>({id,muscle:{'incline-db':'Chest','lat-pulldown':'Back','leg-press':'Quads'}[id]||'Cardio'});
const w=(id,days)=>({endedAt:new Date(now-days*86400000).toISOString(),exercises:[{id,sets:[{weight:100,reps:8},{weight:100,reps:8}]}]});
const x=a.analyze([w('incline-db',0),w('lat-pulldown',15),w('leg-press',7)],exercise,now);
assert.equal(x.zones.upperChest.status,'hot');assert.equal(x.zones.frontDelts.status,'hot');assert.equal(x.zones.lats.status,'cold');assert.equal(x.zones.midBack.status,'cold');assert.equal(x.zones.quads.status,'neutral');assert.equal(x.zones.calves.status,'untracked');
assert.equal(x.total,19);assert.equal(a.analyze([],exercise,now).counts.cold,0);
console.log('PASS: 19-zone anatomy, primary/secondary mapping, 14-day cold, no-history handling');