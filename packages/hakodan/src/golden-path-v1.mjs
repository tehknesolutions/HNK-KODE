import { parse, toHnkIr } from "./parser.mjs";
import { toHom } from "./hom.mjs";

export const GOLDEN_PATH_CONTRACT = "WORLD_ENTITY_PROPERTY_EVENT_ACTION";
export const GOLDEN_PATH_VERSION = "1.0.0";

/**
 * Builds the canonical haKodan Acceleration V1 semantic slice.
 *
 * This function intentionally composes the existing parser, HOM and HNK-IR
 * implementations. It MUST NOT create a second semantic model or reinterpret
 * target/runtime success.
 */
export function buildGoldenPath(source, { profile = "PT-BR" } = {}) {
  const ast = parse(source, { profile });
  const hom = toHom(ast);
  const ir = toHnkIr(ast);

  const world = ast.body?.[0];
  if (world?.kind !== "WorldDeclaration") {
    throw new Error("HAKODAN_GOLDEN_PATH_WORLD_REQUIRED");
  }

  const entity = world.members?.find(member => member.kind === "EntityDeclaration");
  if (!entity) throw new Error("HAKODAN_GOLDEN_PATH_ENTITY_REQUIRED");
  if (!entity.properties?.length) throw new Error("HAKODAN_GOLDEN_PATH_PROPERTY_REQUIRED");

  const event = world.members?.find(member => member.kind === "EventDeclaration");
  if (!event) throw new Error("HAKODAN_GOLDEN_PATH_EVENT_REQUIRED");
  if (!event.actions?.length) throw new Error("HAKODAN_GOLDEN_PATH_ACTION_REQUIRED");

  return Object.freeze({
    contract: GOLDEN_PATH_CONTRACT,
    version: GOLDEN_PATH_VERSION,
    profile,
    ast,
    hom,
    ir
  });
}
