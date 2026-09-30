import test from "node:test";
import assert from "node:assert/strict";
import { authorize, attachProvenance, traceProvenance } from "../src/authority-provenance-v0.9.mjs";

const creator = { id: "creator", capabilities: ["READ","PROPOSE","EDIT","APPROVE","CANONIZE","LOCK","EXECUTE","MANIFEST","PUBLISH"] };
const ai = { id: "ai", capabilities: ["READ","PROPOSE"] };

test("capabilities are explicit and authorship grants no privilege", () => {
  const node = { semanticId: "RULE.PortalKey", author: "ai" };
  assert.equal(authorize("PROPOSE", ai, node).allowed, true);
  assert.equal(authorize("CANONIZE", ai, node).allowed, false);
  assert.equal(authorize("CANONIZE", creator, node).allowed, true);
});

test("provenance events are append-only snapshots", () => {
  const first = attachProvenance({ semanticId: "RULE.PortalKey" }, { source: "VHK", origin: "SOURCE", actor: "creator", operation: "PROPOSE" });
  const second = attachProvenance(first, { source: "CREATOR_GATE", origin: "SOURCE", actor: "creator", operation: "APPROVE" });
  assert.equal(first.provenance.length, 1);
  assert.equal(second.provenance.length, 2);
  assert.deepEqual(traceProvenance(second).map(e => e.operation), ["PROPOSE", "APPROVE"]);
});

test("unknown capability is denied deterministically", () => {
  assert.deepEqual(authorize("CANONIZE", ai, {}), { allowed: false, diagnostic: "HAKODAN_V09_AUTHORITY_DENIED: ai lacks CANONIZE" });
});

import { governedTransition } from "../src/authority-provenance-v0.9.mjs";

test("privileged discovery transitions require authority", () => {
  const candidate = { semanticId: "RULE.PortalKey", state: "CANDIDATE", origin: "SOURCE" };
  assert.throws(() => governedTransition(candidate, "APPROVE", ai), /AUTHORITY_DENIED/);
  const approved = governedTransition(candidate, "APPROVE", creator);
  assert.equal(approved.state, "APPROVED");
  assert.equal(approved.provenance.at(-1).operation, "APPROVE");
});
