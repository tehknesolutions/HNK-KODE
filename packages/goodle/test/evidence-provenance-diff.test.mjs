import test from 'node:test';
import assert from 'node:assert/strict';
import { compareProvenanceSnapshots } from '../src/evidence-provenance-diff.mjs';

const a=[{id:'a',parents:[]},{id:'b',parents:['a']},{id:'c',parents:['b']}];
const b=[{id:'a',parents:[]},{id:'b',parents:['a']},{id:'c',parents:['b','a']}];
test('M27.1/M27.3 reports direct-parent additions',()=>{const r=compareProvenanceSnapshots(a,b,'c');assert.equal(r.status,'COMPARED');assert.deepEqual(r.direct.added,['a']);});
test('M27.4 reports transitive ancestor changes',()=>{const x=[{id:'a',parents:[]},{id:'b',parents:['a']},{id:'c',parents:['b']}];const y=[{id:'a',parents:[]},{id:'b',parents:['a']},{id:'c',parents:['b']},{id:'d',parents:['a']},{id:'e',parents:['d']}];const r=compareProvenanceSnapshots(x,y,'c');assert.equal(r.ancestors.added.length,0);});
test('M27.3 distinguishes parent order',()=>{const x=[{id:'a',parents:[]},{id:'b',parents:[]},{id:'c',parents:['a','b']}];const y=[{id:'a',parents:[]},{id:'b',parents:[]},{id:'c',parents:['b','a']}];const r=compareProvenanceSnapshots(x,y,'c');assert.equal(r.direct.orderingChanged,true);assert.deepEqual(r.direct.added,[]);});
test('M27.2 rejects different roots',()=>{const x=[{id:'a',parents:[]}],y=[{id:'z',parents:[]}];const r=compareProvenanceSnapshots(x,y,'a');assert.equal(r.status,'REJECTED');});
test('M27.5 returns immutable result',()=>{const r=compareProvenanceSnapshots(a,b,'c');assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.direct));});