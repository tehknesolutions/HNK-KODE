import { compilePreOpcode } from "./pre-opcode.mjs";
import { buildOpcodeIr } from "./opcode-ir.mjs";
import { encodeInstructionStream } from "./instruction-encoding.mjs";

export function compileInstructionProgram(ast) {
  const preOpcode = compilePreOpcode(ast);
  const opcodeIr = buildOpcodeIr(ast);
  const instructionBytes = encodeInstructionStream(opcodeIr.instructions);

  return {
    format: "haKodan-instruction-program",
    version: "0.1.0",
    executionModel: preOpcode.executionModel,
    tables: preOpcode.tables,
    opcodeIr,
    instructionBytes
  };
}
