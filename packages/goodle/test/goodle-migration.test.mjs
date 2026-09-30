import test from "node:test";
import assert from "node:assert/strict";
import { resolveGoodleSemantic } from "../src/semantic-bridge.mjs";
import { parseOldRewrite } from "../src/oldrewrite.mjs";
import { lowerGoodleProgram } from "../src/lowering.mjs";

test("Goodle surface preserves its source ID and resolves exact HNK registry IDs only", () => {
  assert.equal(resolveGoodleSemantic("criar").semanticId, "entidade.criar");
  assert.equal(resolveGoodleSemantic("criar").hnkSemanticId, null);
  assert.equal(resolveGoodleSemantic("entidade").hnkSemanticId, "ENTITY");
  assert.equal(resolveGoodleSemantic("quando").hnkSemanticId, "WHEN");
  assert.equal(resolveGoodleSemantic("emitir").hnkSemanticId, "EMIT");
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
  assert.equal(program.nos[0].semantica, "entidade.criar");
  assert.equal(program.nos[3].semantica, "comportamento.reacao.quando");
  assert.equal(program.nos[3].filhos[0].semantica, "dados.valor.diminuir");
});

test("unsupported Goodle semantics remain explicitly unmapped", () => {
  const result = lowerGoodleProgram(parseOldRewrite("posicionar Player em 10 20"));
  assert.equal(result.nodes[0].status, "UNMAPPED");
  assert.equal(result.nodes[0].sourceSemanticId, "espaco.posicao");
});

test("registry-backed Goodle semantics can lower", () => {
  const result = lowerGoodleProgram(parseOldRewrite("quando Player tocar Enemy"));
  assert.equal(result.nodes[0].status, "MAPPED");
  assert.equal(result.nodes[0].semanticId, "WHEN");
});
