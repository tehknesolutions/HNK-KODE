import { toHnkIr } from "./parser.mjs";

export function stableCanonical(value) {
  if (Array.isArray(value)) return value.map(stableCanonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, stableCanonical(value[key])])
    );
  }
  return value;
}

export function canonicalIrObject(ast) {
  return stableCanonical(toHnkIr(ast));
}

export function canonicalIrJson(ast) {
  return JSON.stringify(canonicalIrObject(ast));
}
