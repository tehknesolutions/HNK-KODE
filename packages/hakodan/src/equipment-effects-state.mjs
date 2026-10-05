import { getStatePath } from "./state-path.mjs";

const OPS = new Set(["ADD", "SUBTRACT"]);

function clone(value) {
  return structuredClone(value);
}

function equipmentEntries(subject, equipmentPath) {
  const equipment = getStatePath(subject, equipmentPath);
  if (equipment === undefined || equipment === null) return [];
  if (typeof equipment !== "object" || Array.isArray(equipment)) {
    throw new Error("HAKODAN_EFFECT_INVALID");
  }

  const entries = [];
  for (const slot of Object.keys(equipment)) {
    const item = equipment[slot];
    if (!item) continue;
    if (typeof item !== "object" || Array.isArray(item)) throw new Error("HAKODAN_EFFECT_INVALID");
    if (!Array.isArray(item.effects)) continue;

    item.effects.forEach((effect, effectIndex) => {
      if (!effect || typeof effect !== "object" || Array.isArray(effect)) throw new Error("HAKODAN_EFFECT_INVALID");
      if (typeof effect.stat !== "string" || !effect.stat) throw new Error("HAKODAN_EFFECT_STAT_REQUIRED");
      if (!OPS.has(effect.op)) throw new Error(`HAKODAN_EFFECT_UNSUPPORTED_OP: ${effect.op}`);
      if (typeof effect.value !== "number" || !Number.isFinite(effect.value)) {
        throw new Error(`HAKODAN_EFFECT_NUMERIC_VALUE_REQUIRED: ${effect.stat}`);
      }
      entries.push({
        slot,
        instanceId: item.instanceId,
        id: item.id,
        effectIndex,
        stat: effect.stat,
        op: effect.op,
        value: effect.value
      });
    });
  }
  return entries;
}

export function collectEquipmentEffects(subject, equipmentPath) {
  return equipmentEntries(subject, equipmentPath).map(clone);
}

export function deriveStat(subject, basePath, equipmentPath, stat) {
  if (typeof stat !== "string" || !stat) throw new Error("HAKODAN_EFFECT_STAT_REQUIRED");
  const base = getStatePath(subject, basePath);
  if (!base || typeof base !== "object" || Array.isArray(base) || !Object.prototype.hasOwnProperty.call(base, stat)) {
    throw new Error(`HAKODAN_BASE_STAT_NOT_FOUND: ${stat}`);
  }
  if (typeof base[stat] !== "number" || !Number.isFinite(base[stat])) {
    throw new Error(`HAKODAN_BASE_STAT_NUMERIC_REQUIRED: ${stat}`);
  }

  const modifiers = collectEquipmentEffects(subject, equipmentPath).filter(effect => effect.stat === stat);
  let value = base[stat];
  for (const modifier of modifiers) {
    value = modifier.op === "ADD" ? value + modifier.value : value - modifier.value;
  }

  return { stat, base: base[stat], modifiers, value };
}

export function deriveStats(subject, basePath, equipmentPath) {
  const base = getStatePath(subject, basePath);
  if (!base || typeof base !== "object" || Array.isArray(base)) throw new Error("HAKODAN_BASE_STAT_NOT_FOUND");
  const result = {};
  for (const stat of Object.keys(base)) {
    result[stat] = deriveStat(subject, basePath, equipmentPath, stat);
  }
  return result;
}
