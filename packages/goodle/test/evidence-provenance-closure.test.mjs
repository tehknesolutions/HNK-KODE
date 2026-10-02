import test from 'node:test';
import assert from 'node:assert/strict';
import { closeProvenanceImpact } from '../src/evidence-provenance-closure.mjs';

const diff={direct:{added:['b'],removed:[],orderingChanged:true},ancestors:{added:['a'],removed:[]}};
const impact={status:'ANALYZED',impact:{changedSources:['b'],directChildren:['c'],transitiveDescendants:['c','d'],orderingChanged:true}};

test('M29.1/M29.2 creates deterministic closure summary',()=>{const a=closeProvenanceImpact(diff,impact);const b=closeProvenanceImpact(diff,impact);assert.equal(a.status,'CLOSED');assert.deepEqual(a.summary,b.summary);});
test('M29.3 classifies unresolved derivation conditions',()=>{const r=closeProvenanceImpact(diff,impact);assert.deepEqual(r.summary.unresolved,['DIRECT_PARENT_CHANGE','PARENT_ORDER_CHANGE','TRANSITIVE_ANCESTRY_CHANGE']);});
test('M29.4 summary is immutable',()=>{const r=closeProvenanceImpact(diff,impact);assert.ok(Object.isFrozen(r.summary));assert.ok(Object.isFrozen(r.summary.unresolved));});
test('M29.5 rejects incomplete input',()=>{const r=closeProvenanceImpact({},impact);assert.equal(r.status,'REJECTED');});