import { createFrame, declareRegister, writeRegister, readRegister, setFrameStatus } from "./execution-model.mjs";
import { OPCODES } from "./instruction-encoding.mjs";
import { HaKodanTrap, TRAP_CODES, trapFrame } from "./trap-model.mjs";

function fail(frame, code, instruction, details = {}) {
  const trap = new HaKodanTrap(code, {
    frame,
    instruction,
    details,
    message: code
  });
  trapFrame(frame, trap);
  throw trap;
}

export function createVmFrame(program, { frameId = "vm:0", owner = "haKodan.vm" } = {}) {
  const frame = createFrame({ frameId, kind: "Action", owner, provenance: { program: program.format, version: program.version } });
  for (let i = 0; i < (program.opcodeIr?.registerCount ?? 0); i++) {
    declareRegister(frame, `r${i}`);
  }
  return frame;
}

export function executeInstruction(frame, program, inst) {
  if (!inst || !(inst.op in OPCODES)) return fail(frame, TRAP_CODES.INVALID_OPCODE, inst);
  const tables = program.tables;

  try {
    switch (inst.op) {
      case "NOP":
        return undefined;
      case "LOAD_CONST": {
        const [regOp, constOp] = inst.operands;
        const constant = tables.constants[constOp.value];
        if (!constant) return fail(frame, TRAP_CODES.CONSTANT_NOT_FOUND, inst, { index: constOp.value });
        writeRegister(frame, `r${regOp.value}`, constant.value);
        return constant.value;
      }
      case "LOAD_PROPERTY":
      case "STORE_PROPERTY":
        return fail(frame, TRAP_CODES.RUNTIME_ACTION, inst, { reason: "property runtime not implemented in v0.1" });
      case "CALL_ACTION": {
        const symbol = tables.symbols[inst.operands[0].value];
        if (!symbol) return fail(frame, TRAP_CODES.SYMBOL_NOT_FOUND, inst, { index: inst.operands[0].value });
        const args = inst.operands.slice(1).map(op => readRegister(frame, `r${op.value}`));
        return { symbol, arguments: args };
      }
      case "RETURN": {
        const value = inst.operands.length ? readRegister(frame, `r${inst.operands[0].value}`) : undefined;
        frame.returnValue = value;
        setFrameStatus(frame, "returned");
        return value;
      }
      default:
        return fail(frame, TRAP_CODES.INVALID_OPCODE, inst);
    }
  } catch (error) {
    if (error instanceof HaKodanTrap) throw error;
    const message = String(error?.message ?? error);
    if (message.includes("REGISTER_NOT_DECLARED")) return fail(frame, TRAP_CODES.REGISTER_NOT_DECLARED, inst, { cause: message });
    if (message.includes("UNINITIALIZED_REGISTER")) return fail(frame, TRAP_CODES.UNINITIALIZED_REGISTER, inst, { cause: message });
    if (message.includes("REGISTER_TYPE_MISMATCH")) return fail(frame, TRAP_CODES.REGISTER_TYPE_MISMATCH, inst, { cause: message });
    return fail(frame, TRAP_CODES.RUNTIME_ACTION, inst, { cause: message });
  }
}

export function runInstructionProgram(program, options = {}) {
  const frame = createVmFrame(program, options);
  setFrameStatus(frame, "running");

  const instructions = program.opcodeIr?.instructions ?? [];
  while (frame.status === "running") {
    if (frame.programCounter < 0 || frame.programCounter >= instructions.length) {
      fail(frame, TRAP_CODES.PROGRAM_COUNTER, null, { programCounter: frame.programCounter });
    }
    const inst = instructions[frame.programCounter];
    executeInstruction(frame, program, inst);
    if (frame.status === "running") frame.programCounter += 1;
  }

  return frame;
}
