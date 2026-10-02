import test from 'node:test';
import assert from 'node:assert/strict';
import { roundTripProvenanceClosure } from '../src/evidence-provenance-closure-roundtrip.mjs';

const diff={direct:{added:['b'],removed:[],orderingChanged:false},ancestors:{added:['a'],removed:[]}};
const impact={status:'ANALYZED',impact:{changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false}};
const closure={status:'CLOSED',summary:{version:'m29-v1',changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false,unresolved:['DIRECT_PARENT_CHANGE']}};
const input={closure,diff,impact};

test('M32.1/M32.2 completes create → serialize → import → verify',()=>{const r=roundTripProvenanceClosure(input);assert.equal(r.status,'ROUND_TRIP_VERIFIED');});
test('M32.3 preserves semantic data through round trip',()=>{const r=roundTripProvenanceClosure(input);assert.deepEqual(r.artifact.diff,diff);assert.deepEqual(r.artifact.impact,impact.impact);assert.deepEqual(r.artifact.summary, r.artifact.summary);});
test('M32.4 rejects invalid input before round trip',()=>{const r=roundTripProvenanceClosure({closure:{status:'CLOSED'},diff,impact});assert.equal(r.status,'REJECTED');});
test('M32.5 serialization is deterministic',()=>{const a=roundTripProvenanceClosure(input);const b=roundTripProvenanceClosure(input);assert.equal(a.serialized,b.serialized);});