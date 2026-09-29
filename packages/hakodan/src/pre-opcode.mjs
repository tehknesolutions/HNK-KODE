import { canonicalIrObject } from "./canonical-ir.mjs";
import { buildVmTables } from "./vm-tables.mjs";

export function compilePreOpcode(ast) {
  return {
    format: "haKodan-pre-opcode",
    version: "0.1.0",
    ir: canonicalIrObject(ast),
    tables: buildVmTables(ast)
  };
}
