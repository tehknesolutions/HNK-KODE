import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGoodProjeto, lowerGoodProjeto } from "../src/good-project-adapter.mjs";
import fixture from "./fixtures/good-projeto-m1.json" with { type: "json" };

test("normalizes the Goodle creator model without losing source fields", () => {
  const normalized = normalizeGoodProjeto(fixture);
  assert.equal(normalized.creator.id, "goodle:m1:sample");
  assert.equal(normalized.creator.environment, "hibrido");
  assert.equal(normalized.components[0].configuracao.vida, 100);
  assert.equal(normalized.scenes[0].id, "scene-1");
  assert.equal(normalized.rules[0].id, "rule-1");
  assert.equal(normalized.provenance.sourceRepository, "tehknesolutions/goodle-browser");
});

test("lowers only the supported vertical-slice subset", () => {
  const result = lowerGoodProjeto(fixture);
  assert.equal(result.ast.kind, "Program");
  assert.equal(result.ast.body[0].kind, "WorldDeclaration");
  assert.equal(result.ast.body[0].members[0].kind, "EntityDeclaration");
  assert.equal(result.ast.body[0].members[0].name, "Player");
  assert.equal(result.diagnostics.status, "PARTIAL");
  assert.deepEqual(
    result.diagnostics.unresolved.map(item => item.concept),
    ["cenas", "regras", "componentes.configuracao"]
  );
});

test("does not silently discard creator-level model", () => {
  const result = lowerGoodProjeto(fixture);
  assert.equal(result.preservedCreatorModel.scenes.length, 1);
  assert.equal(result.preservedCreatorModel.rules.length, 1);
  assert.equal(result.preservedCreatorModel.components[0].configuracao.vida, 100);
});
