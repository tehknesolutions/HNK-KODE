import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { compileInstructionProgram } from "../src/instruction-program.mjs";

const pt='mundo W { evento Start { ação run("E") ação heal(100) } }';
const en='world W { event Start { action run("E") action heal(100) } }';

test("instruction program contém tabelas, Opcode IR e bytes",()=>{
  const out=compileInstructionProgram(parse(pt,{profile:"PT-BR"}));
  assert.equal(out.format,"haKodan-instruction-program");
  assert.equal(out.opcodeIr.format,"haKodan-opcode-ir");
  assert.ok(out.instructionBytes.length>0);
  assert.ok(out.tables.symbols.length>0);
});

test("instruction program é byte-identical entre PT-BR e EN",()=>{
  const a=compileInstructionProgram(parse(pt,{profile:"PT-BR"}));
  const b=compileInstructionProgram(parse(en,{profile:"EN"}));
  assert.deepEqual(a.opcodeIr,b.opcodeIr);
  assert.deepEqual(a.instructionBytes,b.instructionBytes);
});
