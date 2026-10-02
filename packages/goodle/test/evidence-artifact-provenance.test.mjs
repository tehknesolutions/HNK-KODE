import test from 'node:test';
import assert from 'node:assert/strict';
import { createArtifactProvenance, verifyArtifactProvenance } from '../src/evidence-artifact-provenance.mjs';

const sources=[{id:'artifact-a',sealDigest:'seal-a',semanticId:'m25'},{id:'artifact-b',sealDigest:'seal-b',semanticId:'m25'}];

test('M25.1/M25.2 creates deterministic provenance fingerprint',()=>{const a=createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'plan-25',sources});const b=createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'plan-25',sources:[sources[1],sources[0]]});assert.equal(a.status,'READY');assert.equal(a.provenance.fingerprint,b.provenance.fingerprint);});
test('M25.3 preserves source references without copying source records',()=>{const r=createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'plan-25',sources});assert.deepEqual(r.provenance.sources.map(x=>x.id),['artifact-a','artifact-b']);assert.equal(Object.hasOwn(r.provenance.sources[0],'state'),false);});
test('M25.4 rejects duplicate and self-referential sources',()=>{assert.equal(createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'p',sources:[sources[0],sources[0]]}).status,'REJECTED');assert.equal(createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'p',sources:[{id:'artifact-c'}]}).status,'REJECTED');});
test('M25.4 verifies a provenance graph without upgrading execution state',()=>{const r=createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'p',sources});const v=verifyArtifactProvenance(r.provenance,[{id:'artifact-a'},{id:'artifact-b'}]);assert.equal(v.valid,true);});
test('M25.5 rejects ambiguous graph nodes',()=>{const r=createArtifactProvenance({derivedArtifactId:'artifact-c',planFingerprint:'p',sources});const v=verifyArtifactProvenance(r.provenance,[{id:'artifact-a'},{id:'artifact-a'}]);assert.equal(v.valid,false);});