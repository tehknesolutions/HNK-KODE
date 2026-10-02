import test from 'node:test';
import assert from 'node:assert/strict';
import { runVerifiedAnchorRegistrySealRoundTrip } from '../src/evidence-provenance-verified-anchor-registry-seal-roundtrip.mjs';

const entry=(digest)=>({digest,snapshotDigest:'snapshot-'+digest,sealDigest:'seal-'+digest,protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',anchor:{digest,snapshotDigest:'snapshot-'+digest,sealDigest:'seal-'+digest,evidenceClass:'PROTOCOL_CONFORMANCE'}});
const input={evidenceClass:'PROTOCOL_CONFORMANCE',entries:[entry('b'),entry('a')]};

test('M55.1/M55.2/M55.3 completes M53→M54 seal round trip',()=>{const r=runVerifiedAnchorRegistrySealRoundTrip(input);assert.equal(r.status,'ANCHOR_REGISTRY_SEAL_ROUND_TRIP_CONFORMANT');assert.deepEqual(r.stages,{M53:'PASS',M54:'PASS'});});
test('M55.4 is deterministic regardless of insertion order',()=>{const a=runVerifiedAnchorRegistrySealRoundTrip(input);const b=runVerifiedAnchorRegistrySealRoundTrip({...input,entries:[...input.entries].reverse()});assert.deepEqual(a,b);});
test('M55.4 classifies invalid registry at M53 creation',()=>{const r=runVerifiedAnchorRegistrySealRoundTrip({evidenceClass:'EXECUTION_EVIDENCE',entries:[]});assert.equal(r.status,'REJECTED');assert.equal(r.failedStage,'M53_CREATE');});
test('M55.4 preserves protocol-conformance boundary',()=>{const r=runVerifiedAnchorRegistrySealRoundTrip(input);assert.equal(r.evidenceClass,'PROTOCOL_CONFORMANCE');assert.equal(r.seal.evidenceClass,'PROTOCOL_CONFORMANCE');});
test('M55.5 result and seal are immutable',()=>{const r=runVerifiedAnchorRegistrySealRoundTrip(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.stages));assert.ok(Object.isFrozen(r.seal));assert.ok(Object.isFrozen(r.seal.entries));});
