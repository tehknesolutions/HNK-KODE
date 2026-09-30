import test from "node:test";
import assert from "node:assert/strict";
import { classifyRuntimeResponsibility } from "../src/runtime-adapter.mjs";

test("M4 keeps canonical execution in haKodan", () => {
  assert.equal(classifyRuntimeResponsibility("execute-canonical-program").owner, "HAKODAN");
  assert.equal(classifyRuntimeResponsibility("evaluate-canonical-event").owner, "HAKODAN");
});

test("M4 keeps creator orchestration in Goodle", () => {
  assert.equal(classifyRuntimeResponsibility("creator-session").owner, "GOODLE");
  assert.equal(classifyRuntimeResponsibility("browser-capability-broker").owner, "GOODLE");
});

test("M4 refuses unknown ownership instead of duplicating kernels", () => {
  assert.equal(classifyRuntimeResponsibility("unknown-runtime-feature").status, "UNRESOLVED");
});
