import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerifiedAnchorRegistry } from '../src/evidence-provenance-verified-anchor-registry.mjs';

const anchor={version:'m49-v1',kind:'GOODLE_SEALED_REGISTRY_SNAPSHOT_ANCHOR',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',snapshotDigest:'snapshot-52',sealDigest:'seal-52',digest:'anchor-52',snapshot:{evidenceClass:'PROTOCOL_CONFORMANCE',seal:{digest:'seal-52',entries:[]}}};
const result={status:'ANCHOR_ROUND_TRIP_CONFORMANT',stages:{M49:'PASS',M50:'PASS'},anchor,evidenceClass:'PROTOCOL_CONFORMANCE'};

test('M52.1/M52.2 registers valid M51 anchor by digest',()=>{const r=createVerifiedAnchorRegistry();const x=r.register(result);assert.equal(x.status,'REGISTERED');assert.equal(r.get('anchor-52').digest,'anchor-52');});
test('M52.3 identical registration is idempotent',()=>{const r=createVerifiedAnchorRegistry();r.register(result);assert.equal(r.register(result).status,'ALREADY_REGISTERED');});
test('M52.3 detects same-digest divergent content',()=>{const r=createVerifiedAnchorRegistry();r.register(result);const conflict={...result,anchor:{...anchor,sealDigest:'different'}};assert.equal(r.register(conflict).status,'REGISTRY_CONFLICT');});
test('M52.1 rejects invalid or promoted input',()=>{const r=createVerifiedAnchorRegistry();assert.equal(r.register({status:'REJECTED'}).status,'REJECTED');assert.equal(r.register({...result,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M52.4 returns immutable entry and snapshot',()=>{const r=createVerifiedAnchorRegistry();r.register(result);const e=r.get('anchor-52');const s=r.snapshot();assert.ok(Object.isFrozen(e));assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.entries));});
