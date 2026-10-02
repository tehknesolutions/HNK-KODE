import test from "node:test";
import assert from "node:assert/strict";
import { parse, canonicalizeAst, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";
import { buildGoldenPath } from "../src/golden-path-v1.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;

const en = `world AbraIsland {
  entity Alakazam { property vida = 100 }
  event Despertar { action despertar("Alakazam") }
}`;

test("Golden Path preserves PT-BR/EN canonical semantic equivalence", () => {
  const a = buildGoldenPath(pt, { profile: "PT-BR" });
  const b = buildGoldenPath(en, { profile: "EN" });

  assert.deepEqual(canonicalizeAst(a.ast), canonicalizeAst(b.ast));
  assert.deepEqual(a.ir, b.ir);
  assert.equal(a.hom.root, b.hom.root);
  assert.equal(a.contract, "WORLD_ENTITY_PROPERTY_EVENT_ACTION");
});

test("Golden Path exposes WORLD→ENTITY→PROPERTY→EVENT→ACTION through AST/HOM/HNK-IR", () => {
  const result = buildGoldenPath(pt, { profile: "PT-BR" });

  assert.equal(result.ast.body[0].kind, "WorldDeclaration");
  assert.equal(result.ir.world.name, "AbraIsland");
  assert.equal(result.ir.world.entities[0].name, "Alakazam");
  assert.equal(result.ir.world.entities[0].properties.vida, 100);
  assert.equal(result.ir.world.events[0].name, "Despertar");
  assert.equal(result.ir.world.events[0].actions[0].name, "despertar");
  assert.equal(result.hom.objects[0].type, "World");
  assert.equal(result.hom.objects[1].type, "Entity");
});

test("Golden Path wrapper does not create a parallel semantic model", () => {
  const result = buildGoldenPath(pt, { profile: "PT-BR" });
  const ast = parse(pt, { profile: "PT-BR" });

  assert.deepEqual(result.ast, ast);
  assert.deepEqual(result.ir, toHnkIr(ast));
  assert.deepEqual(result.hom, toHom(ast));
});

test("Golden Path fails closed when a required semantic stage is absent", () => {
  assert.throws(() => buildGoldenPath(`mundo AbraIsland { entidade Alakazam { propriedade vida = 100 } }`, { profile: "PT-BR" }), /HAKODAN_GOLDEN_PATH_EVENT_REQUIRED/);
});
