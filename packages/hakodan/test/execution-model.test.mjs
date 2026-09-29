import test from "node:test";
import assert from "node:assert/strict";
import { TYPE_IDS } from "../src/type-system.mjs";
import {
  EXECUTION_MODEL,
  createFrame,
  declareRegister,
  writeRegister,
  readRegister,
  setFrameStatus,
  advanceProgramCounter
} from "../src/execution-model.mjs";

test("execution model é hybrid register + structured frame",()=>{
  assert.equal(EXECUTION_MODEL.operandModel,"typed-virtual-registers");
  assert.equal(EXECUTION_MODEL.invocationModel,"structured-frames");
  assert.equal(EXECUTION_MODEL.canonicalOperandStack,false);
});

test("frame possui contexto explícito de execução",()=>{
  const frame=createFrame({
    frameId:"event:0",
    kind:"Event",
    owner:"hnk://world/W/event/Start",
    provenance:{source:"HNK-IR"}
  });
  assert.equal(frame.programCounter,0);
  assert.equal(frame.status,"ready");
  assert.equal(frame.owner,"hnk://world/W/event/Start");
});

test("virtual registers são tipados e fail-closed",()=>{
  const frame=createFrame({frameId:"a",kind:"Action",owner:"action:a"});
  declareRegister(frame,"r0",TYPE_IDS.NUMBER);
  assert.throws(()=>readRegister(frame,"r0"),/TRAP_UNINITIALIZED_REGISTER/);
  writeRegister(frame,"r0",100);
  assert.equal(readRegister(frame,"r0"),100);
  assert.throws(()=>writeRegister(frame,"r0","100"),/REGISTER_TYPE_MISMATCH/);
});

test("register IDs são locais e determinísticos",()=>{
  const frame=createFrame({frameId:"a",kind:"Action",owner:"action:a"});
  declareRegister(frame,"r0",TYPE_IDS.STRING);
  declareRegister(frame,"r1",TYPE_IDS.NUMBER);
  assert.deepEqual(Object.keys(frame.registers),["r0","r1"]);
  assert.throws(()=>declareRegister(frame,"r1",TYPE_IDS.NUMBER),/REGISTER_DUPLICATE/);
});

test("frame lifecycle e program counter são explícitos",()=>{
  const frame=createFrame({frameId:"a",kind:"Action",owner:"action:a"});
  setFrameStatus(frame,"running");
  assert.equal(advanceProgramCounter(frame),1);
  assert.equal(advanceProgramCounter(frame,2),3);
  setFrameStatus(frame,"returned");
  assert.equal(frame.status,"returned");
});
