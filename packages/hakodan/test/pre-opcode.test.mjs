import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { compilePreOpcode } from "../src/pre-opcode.mjs";

const pt='mundo W { entidade E { propriedade vida = 100 } evento Start { ação run("E") } }';
const en='world W { entity E { property vida = 100 } event Start { action run("E") } }';

test("pre-opcode package é idêntico entre PT-BR e EN",()=>{
  assert.deepEqual(
    compilePreOpcode(parse(pt,{profile:"PT-BR"})),
    compilePreOpcode(parse(en,{profile:"EN"}))
  );
});

test("pre-opcode package reúne IR e tabelas VM",()=>{
  const out=compilePreOpcode(parse(pt,{profile:"PT-BR"}));
  assert.equal(out.format,"haKodan-pre-opcode");
  assert.equal(out.ir.ir,"HNK-IR");
  assert.ok(out.tables.symbols.length>0);
  assert.ok(out.tables.constants.length>0);
  assert.equal(out.tables.types.length,6);
});
