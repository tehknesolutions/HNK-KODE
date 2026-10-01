import test from "node:test";
import assert from "node:assert/strict";
import {
  HAKODAN_AUTHORITY_CHAIN,
  createAbsorptionDiscovery,
  compareAbsorptionSources,
  absorbValidatedKnowledge,
  approveAbsorption,
  proposeAbsorption,
  promoteAbsorptionCandidate
} from "../src/knowledge-absorption-v1.mjs";

const actor = Object.freeze({
  id: "TW-DA-VINCI",
  capabilities: ["PROPOSE", "EDIT", "APPROVE", "CANONIZE"]
});

test("authority chain preserves HNK > HNK-KODE > haKodan > vibeHaKodin > Goodle", () => {
  assert.deepEqual([...HAKODAN_AUTHORITY_CHAIN], ["HNK", "HNK-KODE", "haKodan", "vibeHaKodin", "Goodle"]);
  assert.equal(Object.isFrozen(HAKODAN_AUTHORITY_CHAIN), true);
});

test("vibeHaKodin has precedence over Goodle inside HNK context", () => {
  const vibe = createAbsorptionDiscovery({ id: "v1", concept: "renderer", source: "vibeHaKodin" });
  const goodle = createAbsorptionDiscovery({ id: "g1", concept: "renderer", source: "Goodle" });
  const result = compareAbsorptionSources(vibe, goodle);
  assert.equal(result.preferred.id, "v1");
  assert.equal(result.reason, "HNK_AUTHORITY_PRECEDENCE:vibeHaKodin>Goodle");
});

test("Goodle knowledge remains discovery until governed validation and canonization", () => {
  const discovery = createAbsorptionDiscovery({
    id: "goodle-quality-gate",
    concept: "tamper-evident quality evidence",
    source: "Goodle",
    evidence: ["read-only-observation"]
  });
  const canon = absorbValidatedKnowledge({
    discovery,
    actor,
    validation: { passed: true, id: "hakodan-native-validation-v1" }
  });
  assert.equal(canon.state, "CANON");
  assert.equal(canon.source, "Goodle");
  assert.ok(canon.provenance.some((entry) => entry.source === "ABSORPTION_VALIDATION"));
});

test("validation is mandatory before approval", () => {
  const discovery = createAbsorptionDiscovery({ id: "x", concept: "x", source: "Goodle" });
  const proposed = proposeAbsorption(discovery, actor);
  const candidate = promoteAbsorptionCandidate(proposed, actor);
  assert.throws(() => approveAbsorption(candidate, actor, { passed: false }), /HAKODAN_ABSORPTION_VALIDATION_REQUIRED/);
});

test("missing canon authority cannot silently canonize absorbed knowledge", () => {
  const limited = { id: "observer", capabilities: ["PROPOSE", "EDIT", "APPROVE"] };
  const discovery = createAbsorptionDiscovery({ id: "y", concept: "y", source: "Goodle" });
  assert.throws(() => absorbValidatedKnowledge({
    discovery,
    actor: limited,
    validation: { passed: true, id: "validation" }
  }), /lacks CANONIZE/);
});
