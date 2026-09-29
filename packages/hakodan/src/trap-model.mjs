export const TRAP_CODES = Object.freeze({
  UNINITIALIZED_REGISTER: "TRAP_UNINITIALIZED_REGISTER",
  REGISTER_NOT_DECLARED: "TRAP_REGISTER_NOT_DECLARED",
  REGISTER_TYPE_MISMATCH: "TRAP_REGISTER_TYPE_MISMATCH",
  SYMBOL_NOT_FOUND: "TRAP_SYMBOL_NOT_FOUND",
  ADDRESS_NOT_FOUND: "TRAP_ADDRESS_NOT_FOUND",
  CONSTANT_NOT_FOUND: "TRAP_CONSTANT_NOT_FOUND",
  INVALID_OPCODE: "TRAP_INVALID_OPCODE",
  INVALID_OPERAND: "TRAP_INVALID_OPERAND",
  PROGRAM_COUNTER: "TRAP_PROGRAM_COUNTER",
  RUNTIME_ACTION: "TRAP_RUNTIME_ACTION"
});

const CATEGORY_BY_CODE = Object.freeze({
  TRAP_UNINITIALIZED_REGISTER: "RegisterError",
  TRAP_REGISTER_NOT_DECLARED: "RegisterError",
  TRAP_REGISTER_TYPE_MISMATCH: "TypeError",
  TRAP_SYMBOL_NOT_FOUND: "SymbolError",
  TRAP_ADDRESS_NOT_FOUND: "AddressError",
  TRAP_CONSTANT_NOT_FOUND: "ValidationError",
  TRAP_INVALID_OPCODE: "InstructionError",
  TRAP_INVALID_OPERAND: "InstructionError",
  TRAP_PROGRAM_COUNTER: "RuntimeTrap",
  TRAP_RUNTIME_ACTION: "RuntimeTrap"
});

export class HaKodanTrap extends Error {
  constructor(code, {
    message = code,
    frame = null,
    instruction = null,
    provenance = null,
    details = {},
    fatal = true
  } = {}) {
    if (!CATEGORY_BY_CODE[code]) throw new Error(`HAKODAN_UNKNOWN_TRAP_CODE: ${code}`);
    super(message);
    this.name = "HaKodanTrap";
    this.code = code;
    this.category = CATEGORY_BY_CODE[code];
    this.frameId = frame?.frameId ?? null;
    this.owner = frame?.owner ?? null;
    this.programCounter = frame?.programCounter ?? null;
    this.instruction = instruction ? structuredClone(instruction) : null;
    this.provenance = provenance ?? frame?.provenance ?? null;
    this.details = structuredClone(details);
    this.fatal = fatal;
  }

  toJSON() {
    return {
      code: this.code,
      category: this.category,
      message: this.message,
      frameId: this.frameId,
      owner: this.owner,
      programCounter: this.programCounter,
      instruction: this.instruction,
      provenance: this.provenance,
      details: this.details,
      fatal: this.fatal
    };
  }
}

export function trapFrame(frame, trap) {
  if (!(trap instanceof HaKodanTrap)) throw new Error("HAKODAN_TRAP_INVALID");
  frame.status = "trapped";
  frame.trap = trap.toJSON();
  return frame.trap;
}

export function makeTrap(code, options = {}) {
  return new HaKodanTrap(code, options);
}
