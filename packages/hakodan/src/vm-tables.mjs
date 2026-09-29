import { TYPE_IDS } from "./type-system.mjs";
import { toHnkIr } from "./parser.mjs";

const TYPE_ORDER = Object.freeze([
  TYPE_IDS.ANY,
  TYPE_IDS.BOOLEAN,
  TYPE_IDS.NUMBER,
  TYPE_IDS.STRING,
  TYPE_IDS.IDENTIFIER_REF,
  TYPE_IDS.VOID
]);

export function buildTypeTable() {
  return TYPE_ORDER.map((id, index) => ({ index, id }));
}

function constantKey(type, value) {
  return `${type}:${JSON.stringify(value)}`;
}

function runtimeType(value) {
  if (typeof value === "boolean") return TYPE_IDS.BOOLEAN;
  if (typeof value === "number") return TYPE_IDS.NUMBER;
  if (typeof value === "string") return TYPE_IDS.STRING;
  return TYPE_IDS.ANY;
}

export function buildConstantPool(ast) {
  const ir = toHnkIr(ast);
  const entries = [];
  const seen = new Map();

  const add = value => {
    const type = runtimeType(value);
    const key = constantKey(type, value);
    if (seen.has(key)) return seen.get(key);
    const index = entries.length;
    entries.push({ index, type, value });
    seen.set(key, index);
    return index;
  };

  for (const entity of ir.world.entities) {
    for (const name of Object.keys(entity.properties).sort()) add(entity.properties[name]);
  }
  for (const event of ir.world.events) {
    for (const action of event.actions) {
      for (const value of action.arguments) add(value);
    }
  }

  return entries;
}

export function buildSymbolTable(ast) {
  const ir = toHnkIr(ast);
  const entries = [];
  const seen = new Set();

  const add = entry => {
    if (seen.has(entry.id)) throw new Error(`HAKODAN_DUPLICATE_SYMBOL: ${entry.id}`);
    const indexed = { index: entries.length, ...entry };
    entries.push(indexed);
    seen.add(entry.id);
    return indexed.index;
  };

  add({ id: ir.world.id, kind: "World", name: ir.world.name, owner: null, type: "World" });

  for (const entity of [...ir.world.entities].sort((a,b)=>a.id.localeCompare(b.id))) {
    add({ id: entity.id, kind: "Entity", name: entity.name, owner: ir.world.id, type: "Entity" });
    for (const propertyName of Object.keys(entity.properties).sort()) {
      add({
        id: `${entity.id}/property/${propertyName}`,
        kind: "Property",
        name: propertyName,
        owner: entity.id,
        type: entity.propertyTypes[propertyName]
      });
    }
  }

  for (const event of [...ir.world.events].sort((a,b)=>a.name.localeCompare(b.name))) {
    const eventId = `${ir.world.id}/event/${event.name}`;
    add({ id: eventId, kind: "Event", name: event.name, owner: ir.world.id, type: TYPE_IDS.VOID });
    event.actions.forEach((action, index) => {
      add({
        id: `${eventId}/action/${index}-${action.name}`,
        kind: "Action",
        name: action.name,
        owner: eventId,
        type: TYPE_IDS.VOID
      });
    });
  }

  return entries;
}

export function buildVmTables(ast) {
  return {
    version: "0.1.0",
    symbols: buildSymbolTable(ast),
    constants: buildConstantPool(ast),
    types: buildTypeTable()
  };
}
