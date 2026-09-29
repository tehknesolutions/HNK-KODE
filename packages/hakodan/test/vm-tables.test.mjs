import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { buildSymbolTable, buildConstantPool, buildTypeTable, buildVmTables } from "../src/vm-tables.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam {
    propriedade vida = 100
    propriedade nome = "Alakazam"
  }
  evento Despertar {
    ação dizer("Alakazam")
    ação curar(100)
  }
}`;

const en = `world AbraIsland {
  entity Alakazam {
    property vida = 100
    property nome = "Alakazam"
  }
  event Despertar {
    action dizer("Alakazam")
    action curar(100)
  }
}`;

test("PT-BR e EN produzem Symbol Table idêntica", () => {
  assert.deepEqual(buildSymbolTable(parse(pt,{profile:"PT-BR"})), buildSymbolTable(parse(en,{profile:"EN"})));
});

test("Constant Pool deduplica por tipo e valor", () => {
  const pool=buildConstantPool(parse(pt,{profile:"PT-BR"}));
  assert.deepEqual(pool, [
    { index:0, type:"String", value:"Alakazam" },
    { index:1, type:"Number", value:100 }
  ]);
});

test("Type Table possui ordem canônica versionada", () => {
  assert.deepEqual(buildTypeTable(), [
    {index:0,id:"Any"},
    {index:1,id:"Boolean"},
    {index:2,id:"Number"},
    {index:3,id:"String"},
    {index:4,id:"IdentifierRef"},
    {index:5,id:"Void"}
  ]);
});

test("VM tables são determinísticas e independentes do profile", () => {
  const a=buildVmTables(parse(pt,{profile:"PT-BR"}));
  const b=buildVmTables(parse(en,{profile:"EN"}));
  assert.deepEqual(a,b);
  assert.equal(a.symbols[0].kind,"World");
  assert.equal(a.symbols.find(x=>x.kind==="Property"&&x.name==="vida").type,"Number");
});
