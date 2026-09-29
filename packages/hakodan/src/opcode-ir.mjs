import { compilePreOpcode } from "./pre-opcode.mjs";
import { instruction, registerOperand, constantOperand, addressOperand, symbolOperand } from "./instruction-encoding.mjs";

function findConstant(tables, value) {
  const hit=tables.constants.find(x=>Object.is(x.value,value));
  if(!hit) throw new Error(`HAKODAN_OPCODE_CONSTANT_NOT_FOUND: ${JSON.stringify(value)}`);
  return hit.index;
}
function findAddress(tables, address) {
  const hit=tables.addresses.find(x=>x.address===address);
  if(!hit) throw new Error(`HAKODAN_OPCODE_ADDRESS_NOT_FOUND: ${address}`);
  return hit.index;
}
function findSymbol(tables, id) {
  const hit=tables.symbols.find(x=>x.id===id);
  if(!hit) throw new Error(`HAKODAN_OPCODE_SYMBOL_NOT_FOUND: ${id}`);
  return hit.index;
}

export function buildOpcodeIr(ast) {
  const compiled=compilePreOpcode(ast);
  const instructions=[];
  let nextRegister=0;

  for(const dispatch of compiled.tables.dispatch) {
    for(const action of dispatch.actions) {
      const argRegs=[];
      const irEvent=compiled.ir.world.events.find(e=>`${compiled.ir.world.id}/event/${e.name}`===dispatch.eventId);
      const actionIndex=dispatch.actions.findIndex(x=>x.actionId===action.actionId);
      const irAction=irEvent?.actions[actionIndex];
      for(const value of irAction?.arguments ?? []) {
        const reg=nextRegister++;
        instructions.push(instruction("LOAD_CONST",[
          registerOperand(reg),
          constantOperand(findConstant(compiled.tables,value))
        ]));
        argRegs.push(registerOperand(reg));
      }
      instructions.push(instruction("CALL_ACTION",[
        symbolOperand(findSymbol(compiled.tables,action.actionId)),
        ...argRegs
      ]));
    }
  }

  instructions.push(instruction("RETURN",[]));

  return {
    format:"haKodan-opcode-ir",
    version:"0.1.0",
    executionModel:compiled.executionModel,
    registerCount:nextRegister,
    instructions
  };
}
