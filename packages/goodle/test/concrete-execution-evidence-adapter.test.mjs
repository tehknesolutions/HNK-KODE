import test from 'node:test';
import assert from 'node:assert/strict';
import { observeConcreteExecution } from '../src/concrete-execution-evidence-adapter.mjs';

const dispatch = { status: 'ACCEPTED', receipt: { semanticId:'m13', target:'hakodan-manifestation', adapter:'manifestation-bridge-v1', artifact:'plan.hakodan.manifest.json', capabilityId:'goodle.target.hakodan-manifestation-plan.v1', authority:'HAKODAN', status:'DISPATCH_ACCEPTED', executionEvidence:'UNVERIFIED' } };

test('M13 concrete adapter preserves lineage for observed execution', () => {
 const r=observeConcreteExecution(dispatch,{source:'hakodan-runtime',authority:'HAKODAN',observationId:'obs-m13',observedAt:'2026-10-02T12:20:00Z',outcome:'OBSERVED_EXECUTION'});
 assert.equal(r.status,'OBSERVED_EXECUTION'); assert.equal(r.evidence.semanticId,'m13'); assert.equal(r.evidence.authority,'HAKODAN');
});
test('M13 rejects ambiguous outcome',()=>{ const r=observeConcreteExecution(dispatch,{source:'hakodan-runtime',authority:'HAKODAN',outcome:'EXECUTED'}); assert.equal(r.status,'REJECTED'); });
test('M13 does not fabricate NO_EVIDENCE',()=>{ const r=observeConcreteExecution(dispatch,{source:'hakodan-runtime',authority:'HAKODAN',outcome:'NO_EVIDENCE'}); assert.equal(r.status,'NO_EVIDENCE'); assert.equal(r.evidence,null); });
test('M13 rejects authority mismatch',()=>{ const r=observeConcreteExecution(dispatch,{source:'goodle',authority:'GOODLE',outcome:'OBSERVED_EXECUTION',observationId:'x',observedAt:'2026-10-02T12:20:00Z'}); assert.equal(r.status,'REJECTED'); });