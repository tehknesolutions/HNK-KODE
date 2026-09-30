import test from "node:test";
import assert from "node:assert/strict";
import { planManifestation, validateManifestation, listDependents } from "../src/manifestation-graph-v0.9.mjs";

const creator = { id: "creator", capabilities: ["MANIFEST"] };
const observer = { id: "observer", capabilities: ["READ"] };

test("TARGET FORMAT ADAPTER and ARTIFACT remain distinct", () => {
  const request = { semanticId: "PROJECT.Strangeverse", target: "WEB", format: "GAME", adapter: "PHASER", artifact: "dist/game" };
  assert.deepEqual(validateManifestation(request), { valid: true, diagnostics: [] });
  const plan = planManifestation(request, creator);
  assert.equal(plan.target, "WEB");
  assert.equal(plan.format, "GAME");
  assert.equal(plan.adapter, "PHASER");
  assert.equal(plan.artifact, "dist/game");
});

test("one Semantic ID can project multiple manifestations without identity drift", () => {
  const base = { semanticId: "PROJECT.Strangeverse" };
  const plans = [
    planManifestation({ ...base, target: "WEB", format: "GAME", adapter: "PHASER", artifact: "dist/game" }, creator),
    planManifestation({ ...base, target: "DOC", format: "GDD", adapter: "MARKDOWN", artifact: "docs/gdd.md" }, creator),
    planManifestation({ ...base, target: "AI", format: "PROMPT", adapter: "VHK", artifact: "prompts/game.vhk" }, creator)
  ];
  assert.deepEqual(plans.map(p => p.semanticId), Array(3).fill("PROJECT.Strangeverse"));
  assert.deepEqual(listDependents(plans, "PROJECT.Strangeverse").map(p => p.format), ["GAME", "GDD", "PROMPT"]);
});

test("MANIFEST requires explicit authority and only creates a plan", () => {
  const request = { semanticId: "PROJECT.Strangeverse", target: "WEB", format: "GAME", adapter: "PHASER", artifact: "dist/game" };
  assert.throws(() => planManifestation(request, observer), /AUTHORITY_DENIED/);
  const plan = planManifestation(request, creator);
  assert.equal(plan.stage, "PLAN");
  assert.equal(plan.executed, false);
});

test("missing manifestation dimensions fail validation", () => {
  const result = validateManifestation({ semanticId: "PROJECT.Strangeverse", target: "WEB" });
  assert.equal(result.valid, false);
  assert.deepEqual(result.diagnostics, ["HAKODAN_V09_MANIFESTATION_MISSING: FORMAT,ADAPTER,ARTIFACT"]);
});
