import test from "node:test";
import assert from "node:assert/strict";
import { parse, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";

const source = `mundo AbrasIsland {
  entidade Alakazam {
    propriedade x = 0;
    propriedade y = 0;
  }
  entidade Portal {
    propriedade x = 10;
    propriedade y = 0;
    propriedade open = false;
  }
  quando perto(Alakazam, Portal, 2) {
    ação definir(Portal, open, true);
  }
}`;

test("V2-2 parses target-independent reactive rule", () => {
  const ast = parse(source, { profile: "PT-BR" });
  const rule = ast.body[0].members.find(member => member.kind === "WhenDeclaration");
  assert.ok(rule);
  assert.deepEqual(rule.condition, {
    kind: "NearCondition",
    subject: { kind: "EntityReference", name: "Alakazam" },
    target: { kind: "EntityReference", name: "Portal" },
    threshold: { kind: "NumberLiteral", value: 2 }
  });
  assert.equal(rule.actions[0].kind, "SetAction");
  assert.equal(rule.actions[0].subject.name, "Portal");
  assert.equal(rule.actions[0].path.name, "open");
  assert.equal(rule.actions[0].value.value, true);
});

test("V2-2 resolves entity references into canonical HNK-IR ids", () => {
  const ir = toHnkIr(parse(source, { profile: "PT-BR" }));
  assert.equal(ir.world.rules.length, 1);
  assert.deepEqual(ir.world.rules[0].condition, {
    kind: "NEAR",
    subject: "hnk://world/AbrasIsland/entity/Alakazam",
    target: "hnk://world/AbrasIsland/entity/Portal",
    threshold: 2
  });
  assert.deepEqual(ir.world.rules[0].actions[0], {
    kind: "SET",
    subject: "hnk://world/AbrasIsland/entity/Portal",
    path: "open",
    value: true
  });
});

test("V2-2 projects reactive rule into HOM behaviors", () => {
  const hom = toHom(parse(source, { profile: "PT-BR" }));
  const world = hom.objects.find(object => object.type === "World");
  assert.equal(world.behaviors.length, 1);
  assert.equal(world.behaviors[0].kind, "ReactiveRule");
  assert.equal(world.behaviors[0].condition.kind, "NEAR");
  assert.equal(world.behaviors[0].actions[0].kind, "SET");
});

test("V2-2 rejects unresolved reactive entity references", () => {
  const bad = `mundo X { entidade Portal { propriedade open = false; } quando perto(Fantasma, Portal, 2) { ação definir(Portal, open, true); } }`;
  assert.throws(() => toHnkIr(parse(bad, { profile: "PT-BR" })), /HAKODAN_UNKNOWN_ENTITY_REFERENCE/);
});
