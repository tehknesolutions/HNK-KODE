import { canonicalIrObject } from "./canonical-ir.mjs";
import { buildVmTables } from "./vm-tables.mjs";
import { toHom } from "./hom.mjs";
import { buildAddressTable } from "./addressing.mjs";
import { buildEventCatalog } from "./event-dispatch.mjs";
import { EXECUTION_MODEL } from "./execution-model.mjs";

export function compilePreOpcode(ast) {
  const hom = toHom(ast);
  return {
    format: "haKodan-pre-opcode",
    version: "0.1.0",
    executionModel: EXECUTION_MODEL,
    ir: canonicalIrObject(ast),
    tables: {
      ...buildVmTables(ast),
      addresses: buildAddressTable(hom),
      dispatch: buildEventCatalog(hom)
    }
  };
}
