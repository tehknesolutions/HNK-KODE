import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { compileInstructionProgram } from "../src/instruction-program.mjs";
import { HaKodanTrap, TRAP_CODES, makeTrap } from "../src/trap-model.mjs";
import { createVmFrame, executeInstruction, runInstructionProgram } from "../src/vm-runtime.mjs";

const source='mundo W { evento Start { ação run("E") } }';

test("trap possui protocolo serializável estável",()=>{
  const trap=makeTrap(TRAP_CODES.INVALID_OPCODE,{details:{opcode:255}});
  assert.deepEqual(trap.toJSON(),{
    code:"TRAP_INVALID_OPCODE",
    category:"InstructionError",
    message:"TRAP_INVALID_OPCODE",
    frameId:null,
    owner:null,
    programCounter:null,
    instruction:null,
    provenance:null,
    details:{opcode:255},
    fatal:true
  });
});

test("opcode inválido trapifica o frame",()=>{
  const program=compileInstructionProgram(parse(source,{profile:"PT-BR"}));
  const frame=createVmFrame(program);
  frame.status="running";
  assert.throws(()=>executeInstruction(frame,program,{op:"NOPE",operands:[]}),HaKodanTrap);
  assert.equal(frame.status,"trapped");
  assert.equal(frame.trap.code,"TRAP_INVALID_OPCODE");
});

test("constante ausente gera trap canônico",()=>{
  const program=compileInstructionProgram(parse(source,{profile:"PT-BR"}));
  const frame=createVmFrame(program);
  frame.status="running";
  assert.throws(()=>executeInstruction(frame,program,{op:"LOAD_CONST",operands:[{kind:"Register",value:0},{kind:"ConstantIndex",value:999}]}),e=>e.code===TRAP_CODES.CONSTANT_NOT_FOUND);
});

test("programa vertical slice executa até RETURN",()=>{
  const program=compileInstructionProgram(parse(source,{profile:"PT-BR"}));
  const frame=runInstructionProgram(program);
  assert.equal(frame.status,"returned");
  assert.equal(frame.trap,undefined);
});

test("PT-BR e EN preservam mesma semântica de trap",()=>{
  const pt=compileInstructionProgram(parse(source,{profile:"PT-BR"}));
  const en=compileInstructionProgram(parse('world W { event Start { action run("E") } }',{profile:"EN"}));
  for(const program of [pt,en]){
    const frame=createVmFrame(program);
    frame.status="running";
    try { executeInstruction(frame,program,{op:"NOPE",operands:[]}); } catch {}
    assert.equal(frame.trap.code,"TRAP_INVALID_OPCODE");
    assert.equal(frame.trap.category,"InstructionError");
  }
});
