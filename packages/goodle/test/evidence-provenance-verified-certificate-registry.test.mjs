import test from 'node:test';
import assert from 'node:assert/strict';
import { createVerifiedCertificateRegistry } from '../src/evidence-provenance-verified-certificate-registry.mjs';

const result={status:'CERTIFICATE_ROUND_TRIP_CONFORMANT',digest:'cert-43',evidenceClass:'PROTOCOL_CONFORMANCE',stages:{M40:'PASS',M41:'PASS'},certificate:{version:'m40-v1',kind:'GOODLE_PROVENANCE_CONFORMANCE_CERTIFICATE',protocol:'M29-M30-M31-M32-M33-M34-M35-M36-M37-M38-M39',evidenceClass:'PROTOCOL_CONFORMANCE',sourceDigest:'m39-43',stages:{M37:'PASS',M38:'PASS'},digest:'cert-43'}};

test('M43.1/M43.2 registers valid M42 certificate by digest',()=>{const registry=createVerifiedCertificateRegistry();const r=registry.register(result);assert.equal(r.status,'REGISTERED');assert.equal(registry.get('cert-43').digest,'cert-43');});
test('M43.3 identical registration is idempotent',()=>{const registry=createVerifiedCertificateRegistry();registry.register(result);assert.equal(registry.register(result).status,'ALREADY_REGISTERED');});
test('M43.3 detects same-digest divergent content',()=>{const registry=createVerifiedCertificateRegistry();registry.register(result);const conflict={...result,certificate:{...result.certificate,sourceDigest:'different'}};assert.equal(registry.register(conflict).status,'REGISTRY_CONFLICT');});
test('M43.1 rejects invalid or promoted input',()=>{const registry=createVerifiedCertificateRegistry();assert.equal(registry.register({status:'REJECTED'}).status,'REJECTED');assert.equal(registry.register({...result,evidenceClass:'EXECUTION_EVIDENCE'}).status,'REJECTED');});
test('M43.4 returns immutable entry and snapshot',()=>{const registry=createVerifiedCertificateRegistry();registry.register(result);const entry=registry.get('cert-43');const snapshot=registry.snapshot();assert.ok(Object.isFrozen(entry));assert.ok(Object.isFrozen(entry.stages));assert.ok(Object.isFrozen(snapshot));assert.ok(Object.isFrozen(snapshot.entries));});
