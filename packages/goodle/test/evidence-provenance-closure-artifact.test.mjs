import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceClosureArtifact, verifyProvenanceClosureArtifact } from '../src/evidence-provenance-closure-artifact.mjs';

const diff={direct:{added:['b'],removed:[],orderingChanged:false},ancestors:{added:['a'],removed:[]}};
const impact={status:'ANALYZED',impact:{changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false}};
const closure={status:'CLOSED',summary:{version:'m29-v1',changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false,unresolved:['DIRECT_PARENT_CHANGE']}};

test('M30.1/M30.2 creates deterministic closure artifact',()=>{const a=createProvenanceClosureArtifact({closure,diff,impact});const b=createProvenanceClosureArtifact({closure,diff,impact});assert.equal(a.status,'CREATED');assert.equal(a.artifact.digest,b.artifact.digest);assert.equal(a.serialized,b.serialized);});
test('M30.3 preserves source analysis metadata',()=>{const r=createProvenanceClosureArtifact({closure,diff,impact});assert.deepEqual(r.artifact.diff,diff);assert.deepEqual(r.artifact.impact,impact.impact);});
test('M30.4 verifies artifact digest',()=>{const r=createProvenanceClosureArtifact({closure,diff,impact});const v=verifyProvenanceClosureArtifact(r.artifact);assert.equal(v.valid,true);});
test('M30.4 rejects tampered artifact',()=>{const r=createProvenanceClosureArtifact({closure,diff,impact});const v=verifyProvenanceClosureArtifact({...r.artifact,summary:{...r.artifact.summary,orderingChanged:true}});assert.equal(v.valid,false);});
test('M30.5 rejects incomplete closure',()=>{const r=createProvenanceClosureArtifact({closure:{status:'CLOSED'},diff,impact});assert.equal(r.status,'REJECTED');});