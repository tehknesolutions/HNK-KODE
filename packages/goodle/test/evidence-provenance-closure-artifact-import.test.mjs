import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceClosureArtifact } from '../src/evidence-provenance-closure-artifact.mjs';
import { importProvenanceClosureArtifact } from '../src/evidence-provenance-closure-artifact-import.mjs';

const diff={direct:{added:['b'],removed:[],orderingChanged:false},ancestors:{added:['a'],removed:[]}};
const impact={status:'ANALYZED',impact:{changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false}};
const closure={status:'CLOSED',summary:{version:'m29-v1',changedSources:['b'],directChildren:['c'],transitiveDescendants:['c'],orderingChanged:false,unresolved:['DIRECT_PARENT_CHANGE']}};
const artifact=createProvenanceClosureArtifact({closure,diff,impact}).artifact;

test('M31.1/M31.3 imports and verifies a valid M30 artifact',()=>{const r=importProvenanceClosureArtifact(artifact);assert.equal(r.status,'IMPORTED_VERIFIED');assert.equal(r.verification.valid,true);});
test('M31.2 rejects malformed artifacts',()=>{const r=importProvenanceClosureArtifact({version:'m30-v1',kind:'GOODLE_PROVENANCE_CLOSURE_ARTIFACT'});assert.equal(r.status,'REJECTED');});
test('M31.3 rejects tampering',()=>{const r=importProvenanceClosureArtifact({...artifact,summary:{...artifact.summary,orderingChanged:true}});assert.equal(r.status,'REJECTED');});
test('M31.4 returns immutable snapshots',()=>{const r=importProvenanceClosureArtifact(artifact);assert.ok(Object.isFrozen(r.artifact));assert.ok(Object.isFrozen(r.artifact.summary));assert.ok(Object.isFrozen(r.artifact.diff));});
test('M31.4 does not mutate source artifact',()=>{const before=JSON.stringify(artifact);importProvenanceClosureArtifact(artifact);assert.equal(JSON.stringify(artifact),before);});