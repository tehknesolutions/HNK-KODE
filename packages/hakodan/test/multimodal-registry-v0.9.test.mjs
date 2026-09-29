import test from "node:test";
import assert from "node:assert/strict";
import { registerProjection, resolveProjection, roundTripProjection } from "../src/multimodal-registry-v0.9.mjs";

const entry = {
  semanticId: "ACTION.CREATE",
  text: { en: ["CREATE"], ptBR: ["CRIAR", "CRIAÇÃO", "CRIACAO"], hnk: [] },
  glyph: { glyphId: "GLYPH.ACTION.CREATE.CANDIDATE", status: "DISCOVERY", geometry: { family: "ACTION", symmetry: "UNSET" }, hnkMath: { family: "ACTION", position: null } },
  block: { blockType: "ACTION", role: "ACTION", sockets: ["ENTITY", "SCOPE"] }
};

test("text block and glyph metadata resolve through one Semantic ID", () => {
  let registry = registerProjection({}, entry);
  assert.equal(resolveProjection(registry, { surface: "text", value: "CRIAR" }).semanticId, "ACTION.CREATE");
  assert.equal(resolveProjection(registry, { surface: "block", value: "ACTION.CREATE" }).semanticId, "ACTION.CREATE");
  assert.equal(resolveProjection(registry, { surface: "glyph", value: "GLYPH.ACTION.CREATE.CANDIDATE" }).semanticId, "ACTION.CREATE");
});

test("text to block round trip preserves Semantic ID", () => {
  const registry = registerProjection({}, entry);
  const result = roundTripProjection(registry, { surface: "text", value: "CREATE" }, "block");
  assert.equal(result.semanticId, "ACTION.CREATE");
  assert.equal(result.projection.blockType, "ACTION");
});

test("unknown glyph geometry cannot invent a Semantic ID", () => {
  const registry = registerProjection({}, entry);
  assert.equal(resolveProjection(registry, { surface: "glyphGeometry", value: { family: "ACTION" } }), null);
});

test("HNK-MATH metadata remains descriptive and non-executable", () => {
  const registry = registerProjection({}, entry);
  const resolved = resolveProjection(registry, { surface: "glyph", value: "GLYPH.ACTION.CREATE.CANDIDATE" });
  assert.deepEqual(resolved.glyph.hnkMath, { family: "ACTION", position: null });
  assert.equal("execute" in resolved.glyph.hnkMath, false);
});

test("unregistered HNK lexical form is not fabricated", () => {
  const registry = registerProjection({}, entry);
  assert.equal(resolveProjection(registry, { surface: "text", value: "KARU" }), null);
});
