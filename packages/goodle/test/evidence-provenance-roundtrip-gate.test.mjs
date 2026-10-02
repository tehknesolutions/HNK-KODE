import test from 'node:test';
import assert from 'node:assert/strict';
import { runProvenanceRoundTripConformance } from '../src/evidence-provenance-roundtrip-gate.mjs';

const diff={direct:{added:['b'],removed:[],orderingChanged:false},ancestors:{added:['a'],removed:[]}};
const impact={status:'ANALYZED',impact:{changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false}};
const closure={status:'CLOSED',summary:{version:'m29-v1',changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false,unresolved:['DIRECT_PARENT_CHANGE']}};
const input={closure,diff,impact};

test('M33.1/M33.2 passes the complete M30→M31→M32 protocol',()=>{const r=runProvenanceRoundTripConformance(input);assert.equal(r.status,'CONFORMANT');assert.deepEqual(r.stages,{M30:'PASS',M31:'PASS',M32:'PASS'});});
test('M33.3 is deterministic',()=>{const a=runProvenanceRoundTripConformance(input);const b=runProvenanceRoundTripConformance(input);assert.deepEqual(a,b);});
test('M33.4 classifies failed M30 stage',()=>{const r=runProvenanceRoundTripConformance({closure:{status:'CLOSED'},diff,impact});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M30_CREATE');});
test('M33.4 rejects malformed impact before conformance',()=>{const r=runProvenanceRoundTripConformance({closure,diff,impact:{status:'INVALID'}});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M30_CREATE');});
test('M33.5 result is immutable',()=>{const r=runProvenanceRoundTripConformance(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));});