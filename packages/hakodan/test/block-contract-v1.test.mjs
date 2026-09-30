import test from "node:test";
import assert from "node:assert/strict";
import { createBlock, connectBlock, validateBlock, blockToSemanticNode, semanticNodeToBlock } from "../src/block-contract-v1.mjs";

test("v1 block has explicit Semantic ID, category, sockets, types and provenance", () => {
  const block = createBlock({ semanticId: "ACTION.CREATE", category: "ACTION", inputs: [{ id: "entity", type: "ENTITY", required: true }], outputs: [{ id: "result", type: "ENTITY" }] });
  assert.equal(block.kind, "HNKBlockV1");
  assert.equal(block.semanticId, "ACTION.CREATE");
  assert.equal(block.category, "ACTION");
  assert.equal(block.inputs[0].type, "ENTITY");
  assert.equal(block.provenance.status, "PROJECTION");
});

test("compatible blocks connect without changing semantic identity", () => {
  const source = createBlock({ semanticId: "ENTITY.GARUKAN", category: "ENTITY", outputs: [{ id: "out", type: "ENTITY" }] });
  const target = createBlock({ semanticId: "ACTION.CREATE", category: "ACTION", inputs: [{ id: "entity", type: "ENTITY", required: true }] });
  const result = connectBlock(target, "entity", source, "out");
  assert.equal(result.connections[0].source.semanticId, "ENTITY.GARUKAN");
  assert.equal(result.semanticId, "ACTION.CREATE");
});

test("incompatible socket types fail closed", () => {
  const source = createBlock({ semanticId: "DATA.VALUE", category: "DATA", outputs: [{ id: "out", type: "STRING" }] });
  const target = createBlock({ semanticId: "ACTION.CREATE", category: "ACTION", inputs: [{ id: "entity", type: "ENTITY", required: true }] });
  assert.throws(() => connectBlock(target, "entity", source, "out"), /BLOCK_V1_TYPE_MISMATCH/);
});

test("block and semantic node round-trip preserve identity", () => {
  const block = createBlock({ semanticId: "LOGIC.IF", category: "LOGIC", inputs: [{ id: "condition", type: "BOOL", required: true }] });
  const node = blockToSemanticNode(block);
  const restored = semanticNodeToBlock(node);
  assert.equal(restored.semanticId, block.semanticId);
  assert.equal(restored.category, block.category);
  assert.deepEqual(restored.inputs, block.inputs);
});

test("malformed block fails closed", () => {
  assert.deepEqual(validateBlock({ kind: "HNKBlockV1", semanticId: "", category: "ACTION" }).valid, false);
});
