import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceConformanceBundle } from '../src/evidence-provenance-conformance-bundle.mjs';
import { importProvenanceConformanceBundle } from '../src/evidence-provenance-conformance-bundle-import.mjs';
import { createVerifiedBundleRegistry } from '../src/evidence-provenance-verified-bundle-registry.mjs';

const source = { status:'CONFORMANT', stages:{M30:'PASS',M31:'PASS',M32:'PASS'}, digest:'abc123' };
const imported = importProvenanceConformanceBundle(createProvenanceConformanceBundle(source,{ledger:'M33'}).bundle);

test('M36.1/M36.2 registers and looks up only M35 verified imports', () => {
  const registry=createVerifiedBundleRegistry();
  assert.equal(registry.register({status:'REJECTED'}).status,'REJECTED');
  const r=registry.register(imported);
  assert.equal(r.status,'REGISTERED');
  assert.equal(registry.get(r.digest).sourceDigest,'abc123');
});

test('M36.3 exact duplicate registration is idempotent', () => {
  const registry=createVerifiedBundleRegistry();
  registry.register(imported);
  const second=registry.register(imported);
  assert.equal(second.status,'ALREADY_REGISTERED');
  assert.equal(registry.size(),1);
});

test('M36.4 conflicting payload for an existing digest is rejected', () => {
  const registry=createVerifiedBundleRegistry();
  registry.register(imported);
  const conflicting={...imported,bundle:{...imported.bundle,sourceDigest:'different'}};
  const r=registry.register(conflicting);
  assert.equal(r.status,'REJECTED');
  assert.equal(r.reason,'DIGEST_CONFLICT');
  assert.equal(registry.size(),1);
});

test('M36.4 stored entries and snapshots are immutable and caller-independent', () => {
  const registry=createVerifiedBundleRegistry();
  const r=registry.register(imported);
  const snapshot=registry.snapshot();
  assert.ok(Object.isFrozen(r.entry));
  assert.ok(Object.isFrozen(r.entry.stages));
  assert.ok(Object.isFrozen(snapshot));
  assert.equal(snapshot[0].digest,imported.bundle.digest);
});

test('M36 preserves verified provenance metadata exactly', () => {
  const registry=createVerifiedBundleRegistry();
  const {entry}=registry.register(imported);
  assert.equal(entry.protocol,imported.bundle.protocol);
  assert.equal(entry.sourceDigest,imported.bundle.sourceDigest);
  assert.deepEqual(entry.stages,imported.bundle.stages);
  assert.equal(entry.ledger,imported.bundle.ledger);
  assert.equal(entry.createdAt,imported.bundle.createdAt);
  assert.equal(entry.digest,imported.bundle.digest);
});
