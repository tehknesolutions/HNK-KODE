import test from "node:test";
import assert from "node:assert/strict";
import { parseNarrativeSentence, normalizeSemanticSentence } from "../src/narrative-sentence-v0.9.mjs";
import { createFlowNode } from "../src/narrative-flow-v0.9.mjs";
import { governedTransition } from "../src/authority-provenance-v0.9.mjs";
import { planManifestation } from "../src/manifestation-graph-v0.9.mjs";
import { registerProjection, roundTripProjection } from "../src/multimodal-registry-v0.9.mjs";

const creator = { id: "creator", capabilities: ["READ","PROPOSE","EDIT","APPROVE","CANONIZE","MANIFEST"] };
const ai = { id: "ai", capabilities: ["READ","PROPOSE"] };

test("PT-BR EN and mixed narrative variants converge in the vertical slice", () => {
  const variants = ["CREATE Garukan CLASS Teknomage", "CRIAR Garukan CLASSE Teknomage", "CREATE Garukan CLASSE Teknomage"];
  const normalized = variants.map(source => normalizeSemanticSentence(parseNarrativeSentence(source)));
  assert.deepEqual(normalized[0], normalized[1]);
  assert.deepEqual(normalized[1], normalized[2]);
});

test("Strangeverse flow retains identified narrative semantics", () => {
  const flow = createFlowNode("EnterPortal", [
    { semanticId: "WHEN", subject: "Garukan", relation: "ENTER", object: "Portal" },
    { semanticId: "IF", subject: "Garukan", relation: "HAS", object: "NexusKey" },
    { semanticId: "MANIFEST", object: "Nexus" }, { semanticId: "OTHERWISE" }, { semanticId: "EMIT", object: "NeedKey" }
  ]);
  assert.equal(flow.semanticId, "FLOW.EnterPortal");
});

test("unauthorized CANON and MANIFEST fail deterministically", () => {
  const approved = { semanticId: "PROJECT.Strangeverse", state: "APPROVED", origin: "SOURCE" };
  assert.throws(() => governedTransition(approved, "CANONIZE", ai), /AUTHORITY_DENIED/);
  assert.throws(() => planManifestation({ semanticId: "PROJECT.Strangeverse", target: "WEB", format: "GAME", adapter: "PHASER", artifact: "dist/game" }, ai), /AUTHORITY_DENIED/);
});

test("authorized canon, manifestation and text-block projection preserve identity", () => {
  const approved = { semanticId: "PROJECT.Strangeverse", state: "APPROVED", origin: "SOURCE" };
  const canon = governedTransition(approved, "CANONIZE", creator);
  assert.equal(canon.state, "CANON");
  const plan = planManifestation({ semanticId: canon.semanticId, target: "WEB", format: "GAME", adapter: "PHASER", artifact: "dist/game" }, creator);
  assert.equal(plan.semanticId, canon.semanticId);
  const registry = registerProjection({}, { semanticId: "ACTION.CREATE", text: { en: ["CREATE"], ptBR: ["CRIAR"] }, block: { blockType: "ACTION", role: "ACTION", sockets: ["ENTITY"] } });
  const projected = roundTripProjection(registry, { surface: "text", value: "CRIAR" }, "block");
  assert.equal(projected.semanticId, "ACTION.CREATE");
});

test("vertical slice requires an integrated v0.9 pipeline facade", async () => {
  const { runV09VerticalSlice } = await import("../src/v09-pipeline.mjs");
  const result = runV09VerticalSlice("CRIAR Garukan CLASSE Teknomage", creator);
  assert.equal(result.sentence.action.semanticId, "ACTION.CREATE");
  assert.equal(result.manifestation.stage, "PLAN");
  assert.equal(result.projection.semanticId, "ACTION.CREATE");
});
