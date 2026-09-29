export const TYPE_IDS = Object.freeze({
  ANY: "Any",
  BOOLEAN: "Boolean",
  NUMBER: "Number",
  STRING: "String",
  IDENTIFIER_REF: "IdentifierRef",
  VOID: "Void"
});

const KNOWN = new Set(Object.values(TYPE_IDS));

export function assertKnownType(typeId) {
  if (!KNOWN.has(typeId)) throw new Error(`HAKODAN_UNKNOWN_TYPE: ${typeId}`);
  return typeId;
}

export function inferLiteralType(literal) {
  if (!literal || typeof literal !== "object") throw new Error("HAKODAN_INVALID_LITERAL");
  switch (literal.kind) {
    case "BooleanLiteral": return TYPE_IDS.BOOLEAN;
    case "NumberLiteral": return TYPE_IDS.NUMBER;
    case "StringLiteral": return TYPE_IDS.STRING;
    case "IdentifierLiteral": return TYPE_IDS.IDENTIFIER_REF;
    default: throw new Error(`HAKODAN_UNKNOWN_LITERAL_KIND: ${literal.kind}`);
  }
}

export function runtimeTypeOf(value) {
  if (typeof value === "boolean") return TYPE_IDS.BOOLEAN;
  if (typeof value === "number" && Number.isFinite(value)) return TYPE_IDS.NUMBER;
  if (typeof value === "string") return TYPE_IDS.STRING;
  if (value && typeof value === "object" && value.$ref) return TYPE_IDS.IDENTIFIER_REF;
  if (value === undefined) return TYPE_IDS.VOID;
  return TYPE_IDS.ANY;
}

export function isAssignable(fromType, toType) {
  assertKnownType(fromType);
  assertKnownType(toType);
  if (toType === TYPE_IDS.ANY) return true;
  return fromType === toType;
}

export function assertAssignable(value, toType) {
  assertKnownType(toType);
  const fromType = runtimeTypeOf(value);
  if (!isAssignable(fromType, toType)) {
    throw new Error(`HAKODAN_TYPE_MISMATCH: ${fromType} -> ${toType}`);
  }
  return value;
}
