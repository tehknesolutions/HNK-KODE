import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;

test("HOM materializa identidade, propriedades, relações e eventos", () => {
  const hom = toHom(parse(pt, { profile: "PT-BR" }));
  assert.equal(hom.model, "HOM");
  assert.equal(hom.version, "0.1.0");
  assert.equal(hom.objects[0].type, "World");
  assert.equal(hom.objects[1].type, "Entity");
  assert.equal(hom.objects[1].properties.vida, 100);
  assert.deepEqual(hom.objects[1].relations, [{
    kind: "containedBy",
    target: "hnk://world/AbraIsland"
  }]);
  assert.equal(hom.objects[0].events[0].actions[0].name, "despertar");
});

test("HOM preserva provenance do profile sem alterar identidade semântica", () => {
  const en = pt
    .replace("mundo", "world")
    .replace("entidade", "entity")
    .replace("propriedade", "property")
    .replace("evento", "event")
    .replace("ação", "action");
  const a = toHom(parse(pt, { profile: "PT-BR" }));
  const b = toHom(parse(en, { profile: "EN" }));
  assert.equal(a.root, b.root);
  assert.equal(a.objects[1].identity.id, b.objects[1].identity.id);
  assert.equal(a.objects[0].provenance.sourceProfile, "PT-BR");
  assert.equal(b.objects[0].provenance.sourceProfile, "EN");
});
