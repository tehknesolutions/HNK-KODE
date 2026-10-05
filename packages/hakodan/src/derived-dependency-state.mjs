import { getStatePath } from "./state-path.mjs";
import { deriveStat as deriveEquipmentStat } from "./equipment-effects-state.mjs";

const OPS = new Set(["ADD", "SUBTRACT"]);

function clone(value) {
  return structuredClone(value);
}

function numeric(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(\`HAKODAN_DERIVED_DEPENDENCY_NUMERIC_REQUIRED: \${label}\`);
  }
  return value;
}

function orderedDependencies(dependencies) {
  return dependencies.map((dependency, index) => ({ dependency, index })).sort((left, right) => {
    const statOrder = String(left.dependency?.stat ?? "").localeCompare(String(right.dependency?.stat ?? ""));
    return statOrder || left.index - right.index;
  });
}

function readDefinition(subject, definitionsPath, stat) {
  const definitions = getStatePath(subject, definitionsPath);
  if (definitions === undefined || definitions === null) return undefined;
  if (typeof definitions !== "object" || Array.isArray(definitions)) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  }
  return definitions[stat];
}

function validateDependency(dependency) {
  if (!dependency || typeof dependency !== "object" || Array.isArray(dependency) ||
      typeof dependency.stat !== "string" || !dependency.stat) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  }

  const hasOp = dependency.op !== undefined;
  const hasValue = dependency.value !== undefined;
  if (hasOp !== hasValue || (hasOp && !OPS.has(dependency.op))) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  }
  if (hasValue) numeric(dependency.value, dependency.stat);
}

function resolveStat(subject, basePath, definitionsPath, equipmentPath, stat, trail) {
  const base = getStatePath(subject, basePath);
  if (!base || typeof base !== "object" || Array.isArray(base) ||
      !Object.prototype.hasOwnProperty.call(base, stat)) {
    const definition = readDefinition(subject, definitionsPath, stat);
    if (definition === undefined) {
      throw new Error(\`HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: \${stat}\`);
    }
  }

  const definition = readDefinition(subject, definitionsPath, stat);
  if (definition === undefined) {
    return deriveEquipmentStat(subject, basePath, equipmentPath, stat).value;
  }

  if (!definition || typeof definition !== "object" || Array.isArray(definition) ||
      !Array.isArray(definition.dependsOn) || definition.dependsOn.length === 0) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  }

  if (trail.includes(stat)) {
    throw new Error(\`HAKODAN_DERIVED_CYCLE: \${[...trail, stat].join("->")}\`);
  }

  const dependencies = definition.dependsOn;
  const ordered = orderedDependencies(dependencies);
  let value;
  for (const entry of ordered) {
    const dependency = entry.dependency;
    validateDependency(dependency);
    const dependencyValue = resolveStat(subject, basePath, definitionsPath, equipmentPath, dependency.stat, [...trail, stat]);
    if (dependency.op === undefined) {
      if (value === undefined) value = dependencyValue;
      else value += dependencyValue;
    } else if (dependency.op === "ADD") {
      if (value === undefined) value = dependencyValue;
      value += dependency.value;
    } else {
      if (value === undefined) value = dependencyValue;
      value -= dependency.value;
    }
  }

  return numeric(value, stat);
}

export function deriveStat(subject, basePath, definitionsPath, equipmentPath, stat) {
  if (typeof stat !== "string" || !stat) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_REQUIRED");
  }

  const definitions = getStatePath(subject, definitionsPath);
  if (definitions !== undefined && definitions !== null &&
      (typeof definitions !== "object" || Array.isArray(definitions))) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  }

  const value = resolveStat(subject, basePath, definitionsPath, equipmentPath, stat, []);
  const definition = readDefinition(subject, definitionsPath, stat);
  const dependencies = definition?.dependsOn ?? [{ stat, op: undefined }];

  return {
    stat,
    value,
    dependencies: orderedDependencies(dependencies).map(({ dependency }) => clone(dependency))
  };
}

export function deriveStats(subject, basePath, definitionsPath, equipmentPath) {
  const definitions = getStatePath(subject, definitionsPath);
  if (!definitions || typeof definitions !== "object" || Array.isArray(definitions)) {
    throw new Error("HAKODAN_DERIVED_DEPENDENCY_REQUIRED");
  }

  const result = {};
  for (const stat of Object.keys(definitions).sort((a, b) => a.localeCompare(b))) {
    result[stat] = deriveStat(subject, basePath, definitionsPath, equipmentPath, stat);
  }
  return result;
}
