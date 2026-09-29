import test from "node:test";
import assert from "node:assert/strict";
import { parse, canonicalizeAst, toHnkIr } from "../src/parser.mjs";
import { compilePreOpcode } from "../src/pre-opcode.mjs";

const pt = 'mundo genesis { entidade light { propriedade active = false } evento awaken { ação activate("light") } }';
const en = 'world genesis { entity light { property active = false } event awaken { action activate("light") } }';

test("MHCM vertical slice converges PT-BR and EN into one canonical AST", () => {
  const ptAst = canonicalizeAst(parse(pt, { profile: "PT-BR" }));
  const enAst = canonicalizeAst(parse(en, { profile: "EN" }));
  assert.deepEqual(ptAst, enAst);
});

test("MHCM vertical slice lowers world/entity/property/event/action into HNK-IR", () => {
  const ir = toHnkIr(parse(pt, { profile: "PT-BR" }));
  assert.equal(ir.ir, "HNK-IR");
  assert.equal(ir.world.name, "genesis");
  assert.deepEqual(ir.world.entities, [{
    id: "hnk://world/genesis/entity/light",
    name: "light",
    properties: { active: false },
    propertyTypes: { active: "boolean" }
  }]);
  assert.deepEqual(ir.world.events, [{
    name: "awaken",
    actions: [{ name: "activate", arguments: ["light"] }]
  }]);
});

test("MHCM vertical slice reaches haKodan pre-opcode without parallel runtime", () => {
  const ptOut = compilePreOpcode(parse(pt, { profile: "PT-BR" }));
  const enOut = compilePreOpcode(parse(en, { profile: "EN" }));

  assert.deepEqual(ptOut, enOut);
  assert.equal(ptOut.format, "haKodan-pre-opcode");
  assert.equal(ptOut.executionModel.id, "haKodan.hybrid-register-frame");
  assert.equal(ptOut.ir.ir, "HNK-IR");
  assert.equal(ptOut.ir.world.name, "genesis");
  assert.equal(ptOut.ir.world.entities[0].name, "light");
  assert.equal(ptOut.ir.world.entities[0].properties.active, false);
  assert.equal(ptOut.ir.world.events[0].name, "awaken");
  assert.equal(ptOut.ir.world.events[0].actions[0].name, "activate");
  assert.ok(ptOut.tables.symbols.length > 0);
  assert.ok(ptOut.tables.addresses.length > 0);
});
