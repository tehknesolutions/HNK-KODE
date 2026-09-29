import { assertKnownType, TYPE_IDS, runtimeTypeOf, isAssignable } from "./type-system.mjs";

export const EXECUTION_MODEL = Object.freeze({
  id: "haKodan.hybrid-register-frame",
  version: "0.1.0",
  operandModel: "typed-virtual-registers",
  invocationModel: "structured-frames",
  canonicalOperandStack: false
});

export function createFrame({
  frameId,
  kind,
  owner,
  parentFrame = null,
  arguments: args = [],
  capabilityContext = {},
  provenance = null
}) {
  if (!frameId) throw new Error("HAKODAN_FRAME_ID_REQUIRED");
  if (!["World","Event","Action"].includes(kind)) throw new Error(`HAKODAN_FRAME_KIND_INVALID: ${kind}`);
  if (!owner) throw new Error("HAKODAN_FRAME_OWNER_REQUIRED");

  return {
    frameId,
    kind,
    owner,
    parentFrame,
    registers: {},
    arguments: structuredClone(args),
    returnValue: undefined,
    programCounter: 0,
    capabilityContext: structuredClone(capabilityContext),
    provenance,
    status: "ready"
  };
}

export function declareRegister(frame, registerId, type = TYPE_IDS.ANY, provenance = null) {
  assertKnownType(type);
  if (!/^r\d+$/.test(registerId)) throw new Error(`HAKODAN_REGISTER_ID_INVALID: ${registerId}`);
  if (frame.registers[registerId]) throw new Error(`HAKODAN_REGISTER_DUPLICATE: ${registerId}`);
  frame.registers[registerId] = { id: registerId, type, value: undefined, initialized: false, provenance };
  return frame.registers[registerId];
}

export function writeRegister(frame, registerId, value) {
  const register = frame.registers[registerId];
  if (!register) throw new Error(`HAKODAN_REGISTER_NOT_DECLARED: ${registerId}`);
  const actual = runtimeTypeOf(value);
  if (!isAssignable(actual, register.type)) {
    throw new Error(`HAKODAN_REGISTER_TYPE_MISMATCH: ${actual} -> ${register.type}`);
  }
  register.value = value;
  register.initialized = true;
  return value;
}

export function readRegister(frame, registerId) {
  const register = frame.registers[registerId];
  if (!register) throw new Error(`HAKODAN_REGISTER_NOT_DECLARED: ${registerId}`);
  if (!register.initialized) throw new Error(`HAKODAN_TRAP_UNINITIALIZED_REGISTER: ${registerId}`);
  return register.value;
}

export function setFrameStatus(frame, status) {
  if (!["ready","running","returned","trapped"].includes(status)) {
    throw new Error(`HAKODAN_FRAME_STATUS_INVALID: ${status}`);
  }
  frame.status = status;
  return frame;
}

export function advanceProgramCounter(frame, amount = 1) {
  if (!Number.isInteger(amount) || amount < 0) throw new Error("HAKODAN_PC_ADVANCE_INVALID");
  frame.programCounter += amount;
  return frame.programCounter;
}
