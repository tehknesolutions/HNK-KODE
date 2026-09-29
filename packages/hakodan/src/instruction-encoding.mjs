export const OPERAND_KIND = Object.freeze({
  None: 0,
  Register: 1,
  ConstantIndex: 2,
  AddressIndex: 3,
  SymbolIndex: 4
});

export const OPCODES = Object.freeze({
  NOP: 0x00,
  LOAD_CONST: 0x01,
  LOAD_PROPERTY: 0x02,
  STORE_PROPERTY: 0x03,
  CALL_ACTION: 0x04,
  RETURN: 0x05
});

const SPECS = Object.freeze({
  NOP: [],
  LOAD_CONST: ["Register","ConstantIndex"],
  LOAD_PROPERTY: ["Register","AddressIndex"],
  STORE_PROPERTY: ["AddressIndex","Register"],
  CALL_ACTION: ["SymbolIndex","Register*"],
  RETURN: ["Register?"]
});

export function instruction(op, operands = []) {
  if (!(op in OPCODES)) throw new Error(`HAKODAN_OPCODE_UNKNOWN: ${op}`);
  validateOperands(op, operands);
  return { op, operands: operands.map(x => ({ ...x })) };
}

function kindAllowed(actual, expected) {
  if (expected.endsWith("*")) return actual === expected.slice(0,-1);
  if (expected.endsWith("?")) return actual === expected.slice(0,-1);
  return actual === expected;
}

export function validateOperands(op, operands) {
  const spec = SPECS[op];
  if (!spec) throw new Error(`HAKODAN_OPCODE_UNKNOWN: ${op}`);

  if (op === "CALL_ACTION") {
    if (operands.length < 1) throw new Error("HAKODAN_OPCODE_ARITY: CALL_ACTION");
    if (operands[0]?.kind !== "SymbolIndex") throw new Error("HAKODAN_OPCODE_OPERAND_KIND: CALL_ACTION[0]");
    for (let i=1;i<operands.length;i++) {
      if (operands[i]?.kind !== "Register") throw new Error(`HAKODAN_OPCODE_OPERAND_KIND: CALL_ACTION[${i}]`);
    }
    return true;
  }

  if (op === "RETURN") {
    if (operands.length > 1) throw new Error("HAKODAN_OPCODE_ARITY: RETURN");
    if (operands.length === 1 && operands[0]?.kind !== "Register") throw new Error("HAKODAN_OPCODE_OPERAND_KIND: RETURN[0]");
    return true;
  }

  if (operands.length !== spec.length) throw new Error(`HAKODAN_OPCODE_ARITY: ${op}`);
  operands.forEach((operand,i)=>{
    if (!kindAllowed(operand?.kind,spec[i])) throw new Error(`HAKODAN_OPCODE_OPERAND_KIND: ${op}[${i}]`);
  });
  return true;
}

export function registerOperand(index) {
  if (!Number.isInteger(index) || index < 0) throw new Error("HAKODAN_REGISTER_INDEX_INVALID");
  return { kind:"Register", value:index };
}
export function constantOperand(index) {
  if (!Number.isInteger(index) || index < 0) throw new Error("HAKODAN_CONSTANT_INDEX_INVALID");
  return { kind:"ConstantIndex", value:index };
}
export function addressOperand(index) {
  if (!Number.isInteger(index) || index < 0) throw new Error("HAKODAN_ADDRESS_INDEX_INVALID");
  return { kind:"AddressIndex", value:index };
}
export function symbolOperand(index) {
  if (!Number.isInteger(index) || index < 0) throw new Error("HAKODAN_SYMBOL_INDEX_INVALID");
  return { kind:"SymbolIndex", value:index };
}

export function encodeInstruction(inst) {
  validateOperands(inst.op, inst.operands);
  const size = 2 + inst.operands.length * 5;
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  view.setUint8(0, OPCODES[inst.op]);
  view.setUint8(1, inst.operands.length);
  inst.operands.forEach((operand,i)=>{
    const off=2+i*5;
    view.setUint8(off, OPERAND_KIND[operand.kind]);
    view.setUint32(off+1, operand.value >>> 0, false);
  });
  return bytes;
}

export function encodeInstructionStream(instructions) {
  const encoded=instructions.map(encodeInstruction);
  const total=encoded.reduce((n,b)=>n+b.length,0);
  const out=new Uint8Array(total);
  let offset=0;
  for(const bytes of encoded){ out.set(bytes,offset); offset+=bytes.length; }
  return out;
}
