import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGoodleDefinition, lowerGoodleFlow } from "../src/behavior-adapter.mjs";

const definition = {
  componentes: ["Player", "Enemy"],
  fluxos: [{
    id: "flow-hit",
    nome: "Player toca Enemy",
    quando: { tipo: "evento", nome: "tocar", parametros: { fonte: "Player", alvo: "Enemy" } },
    executar: [{ tipo: "acao", nome: "diminuir", parametros: { entidade: "Enemy", propriedade: "vida", valor: 10 } }]
  }],
  dados: [{ id: "vida", nome: "vida", tipo: "numero", persistente: true, valorInicial: 100 }],
  regras: [{
    id: "rule-alive",
    nome: "Somente vivo",
    quando: { tipo: "condicao", nome: "maiorQueZero", parametros: { dado: "vida" } },
    permitir: true
  }]
};

test("normalization preserves Goodle behavior, data and rules", () => {
  const normalized = normalizeGoodleDefinition(definition);
  assert.equal(normalized.flows[0].when.name, "tocar");
  assert.equal(normalized.data[0].persistent, true);
  assert.equal(normalized.rules[0].allow, true);
  assert.equal(normalized.provenance.sourcePath, "src/nucleo/modelo/SintaxeGoodle.ts");
});

test("flow lowering creates canonical event/action descriptors only for supported shape", () => {
  const lowered = lowerGoodleFlow(definition.fluxos[0], { worldId: "hnk://world/Demo" });
  assert.equal(lowered.status, "MAPPED");
  assert.equal(lowered.event.kind, "EventDescriptorCandidate");
  assert.equal(lowered.event.name, "tocar");
  assert.equal(lowered.event.actions[0].kind, "ActionDescriptorCandidate");
  assert.equal(lowered.event.actions[0].name, "diminuir");
});

test("conditions and else branches remain explicit unresolved semantics", () => {
  const flow = {
    id: "flow-conditional",
    nome: "conditional",
    quando: { tipo: "condicao", nome: "temVida", senao: [{ tipo: "acao", nome: "parar" }] },
    executar: []
  };
  const lowered = lowerGoodleFlow(flow, { worldId: "hnk://world/Demo" });
  assert.equal(lowered.status, "UNRESOLVED");
  assert.ok(lowered.diagnostics.some(x => x.code === "GOODLE_CONDITION_NOT_CANONICAL"));
  assert.ok(lowered.diagnostics.some(x => x.code === "GOODLE_ELSE_NOT_CANONICAL"));
});
