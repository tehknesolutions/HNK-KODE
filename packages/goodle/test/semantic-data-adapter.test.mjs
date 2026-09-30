import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyGoodleSemantic,
  normalizeGoodleData,
  lowerGoodleCondition
} from "../src/semantic-data-adapter.mjs";

test("M3 maps only exact executable registry-backed semantic concepts", () => {
  const when = classifyGoodleSemantic("quando");
  assert.equal(when.status, "MAPPED");
  assert.equal(when.semanticId, "WHEN");
  assert.equal(when.executable, true);
  assert.equal(classifyGoodleSemantic("tocar").status, "UNMAPPED");
  assert.equal(classifyGoodleSemantic("diminuir").status, "UNMAPPED");
});

test("M3 preserves data type, persistence and initial value without inventing storage semantics", () => {
  const data = normalizeGoodleData({
    id: "vida",
    nome: "vida",
    tipo: "numero",
    persistente: true,
    valorInicial: 100
  });
  assert.equal(data.id, "vida");
  assert.equal(data.sourceType, "numero");
  assert.equal(data.persistent, true);
  assert.equal(data.initialValue, 100);
  assert.equal(data.storage.status, "UNRESOLVED");
});

test("M3 keeps unknown Goodle conditions unresolved", () => {
  const result = lowerGoodleCondition({
    tipo: "condicao",
    nome: "maiorQueZero",
    parametros: { dado: "vida" }
  });
  assert.equal(result.status, "UNRESOLVED");
  assert.equal(result.sourceCondition, "maiorQueZero");
  assert.equal(result.semanticId, null);
  assert.equal(result.executable, false);
});

test("M3 recognizes spec-only IF and ELSE without treating them as executable", () => {
  const ifToken = classifyGoodleSemantic("se");
  const elseToken = classifyGoodleSemantic("senão");
  assert.equal(ifToken.semanticId, "IF");
  assert.equal(ifToken.status, "UNRESOLVED");
  assert.equal(ifToken.executable, false);
  assert.equal(elseToken.semanticId, "ELSE");
  assert.equal(elseToken.status, "UNRESOLVED");
  assert.equal(elseToken.executable, false);
});
