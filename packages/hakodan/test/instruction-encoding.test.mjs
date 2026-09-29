import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import {
  OPCODES,
  instruction,
  registerOperand,
  constantOperand,
  symbolOperand,
  encodeInstruction,
  encodeInstructionStream
} from "../src/instruction-encoding.mjs";
import { buildOpcodeIr } from "../src/opcode-ir.mjs";

test("opcode numbers são estáveis e explícitos",()=>{
  assert.deepEqual(OPCODES,{NOP:0,LOAD_CONST:1,LOAD_PROPERTY:2,STORE_PROPERTY:3,CALL_ACTION:4,RETURN:5});
});

test("instruction encoder usa formato determinístico",()=>{
  const inst=instruction("LOAD_CONST",[registerOperand(2),constantOperand(7)]);
  const bytes=encodeInstruction(inst);
  assert.equal(bytes.length,12);
  assert.deepEqual(Array.from(bytes.slice(0,2)),[1,2]);
});

test("CALL_ACTION aceita symbol + registers",()=>{
  const inst=instruction("CALL_ACTION",[symbolOperand(4),registerOperand(0),registerOperand(1)]);
  assert.equal(encodeInstruction(inst).length,17);
});

test("operand kinds inválidos são rejeitados",()=>{
  assert.throws(()=>instruction("LOAD_CONST",[constantOperand(0),registerOperand(0)]),/OPERAND_KIND/);
});

const pt='mundo W { evento Start { ação run("E") ação heal(100) } }';
const en='world W { event Start { action run("E") action heal(100) } }';

test("PT-BR e EN geram Opcode IR idêntico",()=>{
  assert.deepEqual(
    buildOpcodeIr(parse(pt,{profile:"PT-BR"})),
    buildOpcodeIr(parse(en,{profile:"EN"}))
  );
});

test("PT-BR e EN geram instruction stream byte-for-byte idêntico",()=>{
  const a=buildOpcodeIr(parse(pt,{profile:"PT-BR"}));
  const b=buildOpcodeIr(parse(en,{profile:"EN"}));
  assert.deepEqual(encodeInstructionStream(a.instructions),encodeInstructionStream(b.instructions));
});
