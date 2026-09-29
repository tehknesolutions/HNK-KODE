import test from "node:test";
import assert from "node:assert/strict";
import { parse, canonicalizeAst, toHnkIr } from "../src/parser.mjs";

const pt = `
mundo AbraIsland {
  entidade Alakazam {
    propriedade vida = 100
  }
  evento Despertar {
    ação despertar("Alakazam")
  }
}
`;

const en = `
world AbraIsland {
  entity Alakazam {
    property vida = 100
  }
  event Despertar {
    action despertar("Alakazam")
  }
}
`;

test("PT-BR e EN convergem para a mesma AST canônica", () => {
  assert.deepEqual(canonicalizeAst(parse(pt, { profile: "PT-BR" })), canonicalizeAst(parse(en, { profile: "EN" })));
});

test("PT-BR e EN convergem para o mesmo HNK-IR", () => {
  assert.deepEqual(toHnkIr(parse(pt, { profile: "PT-BR" })), toHnkIr(parse(en, { profile: "EN" })));
});

test("profile HNK permanece bloqueado enquanto keywords HNK estão unresolved", () => {
  assert.throws(() => parse("KODAN Teste {}", { profile: "HNK" }), /HAKODAN_HNK_PROFILE_LOCKED/);
});

test("vertical slice materializa world/entity/property/event/action", () => {
  const ir = toHnkIr(parse(pt, { profile: "PT-BR" }));
  assert.equal(ir.world.name, "AbraIsland");
  assert.equal(ir.world.entities[0].properties.vida, 100);
  assert.deepEqual(ir.world.events[0].actions[0], { name: "despertar", arguments: ["Alakazam"] });
});
