import test from "node:test";
import assert from "node:assert/strict";
import { resolveGoodleSemantic } from "../src/semantic-bridge.mjs";
import { parseOldRewrite } from "../src/oldrewrite.mjs";
import { lowerGoodleProgram } from "../src/lowering.mjs";

test("Goodle surface resolves to HNK semantic identity", () => {
  assert.equal(resolveGoodleSemantic("criar").semanticId, "ACTION.CREATE");
  assert.equal(resolveGoodleSemantic("create").semanticId, "ACTION.CREATE");
});

test("OldRewrite remains a creator-layer surface", () => {
  const program = parseOldRewrite([
    "criar entidade Player",
    "posicionar Player em 10 20",
    "definir vida de Player como 100",
    "quando Player tocar Enemy",
    "  diminuir vida de Enemy em 10"
  ].join("\n"));

  assert.equal(program.versao, "1");
  assert.equal(program.nos.length, 4);
  assert.equal(program.nos[0].semantica, "ACTION.CREATE");
  assert.equal(program.nos[3].semantica, "EVENT.WHEN");
  assert.equal(program.nos[3].filhos[0].semantica, "DATA.DECREASE");
});

test("unmapped Goodle semantics remain explicit instead of being invented", () => {
  const result = lowerGoodleProgram(parseOldRewrite("posicionar Player em 10 20"));
  assert.equal(result.nodes[0].status, "UNMAPPED");
  assert.equal(result.nodes[0].sourceSemanticId, "SPACE.POSITION");
});
