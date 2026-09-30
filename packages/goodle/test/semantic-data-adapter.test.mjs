import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyGoodleSemantic,
  normalizeGoodleData,
  lowerGoodleCondition
} from "../src/semantic-data-adapter.mjs";

test("M3 maps only exact registry-backed semantic concepts", () => {
  assert.deepEqual(classifyGoodleSemantic("quando"), {
    status: "MAPPED",
    semanticId: "WHEN",
    sourceTerm: "quando"
  });
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
});

test("M3 recognizes IF and ELSE as registry concepts without inventing condition operators", () => {
  assert.equal(classifyGoodleSemantic("se").semanticId, "IF");
  assert.equal(classifyGoodleSemantic("senão").semanticId, "ELSE");
});
