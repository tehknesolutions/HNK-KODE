import test from 'node:test';
import assert from 'node:assert/strict';
import { traverseProvenance } from '../src/evidence-provenance-traversal.mjs';

const graph=[{id:'a',parents:[]},{id:'b',parents:['a']},{id:'c',parents:['b']}];
test('M26.1/M26.3 returns deterministic direct parents',()=>{const r=traverseProvenance(graph,'c');assert.equal(r.status,'TRAVERSED');assert.deepEqual(r.directParents,['b']);});
test('M26.4 returns transitive ancestors',()=>{const r=traverseProvenance(graph,'c');assert.deepEqual(r.ancestors,['b','a']);});
test('M26.4 rejects cycles',()=>{const r=traverseProvenance([{id:'a',parents:['b']},{id:'b',parents:['a']}],'a');assert.equal(r.status,'REJECTED');assert.equal(r.reason,'CYCLE_DETECTED');});
test('M26.2 rejects duplicate graph identities',()=>{const r=traverseProvenance([{id:'a',parents:[]},{id:'a',parents:[]}],'a');assert.equal(r.status,'REJECTED');assert.equal(r.reason,'AMBIGUOUS_GRAPH');});
test('M26.4 rejects missing references',()=>{const r=traverseProvenance([{id:'a',parents:['missing']}],'a');assert.equal(r.status,'REJECTED');assert.equal(r.reason,'MISSING_REFERENCE');});
test('M26.5 returns immutable traversal snapshots',()=>{const r=traverseProvenance(graph,'c');assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.directParents));});