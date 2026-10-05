import { getStatePath } from "./state-path.mjs";
import { deriveStat as deriveEquipmentStat } from "./equipment-effects-state.mjs";

const OPS = new Set(["ADD", "SUBTRACT"]);

function clone(value) { return structuredClone(value); }
function numeric(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NUMERIC_REQUIRED: ${label}`);
  return value;
}
function orderedDependencies(dependencies) {
  return dependencies.map((dependency,index)=>({dependency,index})).sort((a,b)=>String(a.dependency?.stat??"").localeCompare(String(b.dependency?.stat??"")) || a.index-b.index);
}
function definitionsAt(subject,path) {
  const definitions=getStatePath(subject,path);
  if (definitions===undefined || definitions===null) return undefined;
  if (typeof definitions!=="object" || Array.isArray(definitions)) throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  return definitions;
}
function validateDependency(dependency) {
  if (!dependency || typeof dependency!=="object" || Array.isArray(dependency) || typeof dependency.stat!=="string" || !dependency.stat) throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  const hasOp=dependency.op!==undefined, hasValue=dependency.value!==undefined;
  if (hasOp!==hasValue || (hasOp && !OPS.has(dependency.op))) throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  if (hasValue) numeric(dependency.value,dependency.stat);
}
function resolveStat(subject,basePath,definitionsPath,equipmentPath,stat,trail) {
  if (trail.includes(stat)) throw new Error(`HAKODAN_DERIVED_CYCLE: ${[...trail,stat].join("->")}`);
  const base=getStatePath(subject,basePath);
  const definitions=definitionsAt(subject,definitionsPath);
  const definition=definitions?.[stat];
  const hasBase=Boolean(base && typeof base==="object" && !Array.isArray(base) && Object.prototype.hasOwnProperty.call(base,stat));
  if (definition===undefined) {
    if (!hasBase) throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: ${stat}`);
    return deriveEquipmentStat(subject,basePath,equipmentPath,stat).value;
  }
  if (!definition || typeof definition!=="object" || Array.isArray(definition) || !Array.isArray(definition.dependsOn) || definition.dependsOn.length===0) throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
  let value;
  for (const {dependency} of orderedDependencies(definition.dependsOn)) {
    validateDependency(dependency);
    const dependencyValue=resolveStat(subject,basePath,definitionsPath,equipmentPath,dependency.stat,[...trail,stat]);
    if (value===undefined) value=dependencyValue;
    else if (dependency.op===undefined) value+=dependencyValue;
    if (dependency.op==="ADD") value+=dependency.value;
    if (dependency.op==="SUBTRACT") value-=dependency.value;
  }
  return numeric(value,stat);
}
export function deriveStat(subject,basePath,definitionsPath,equipmentPath,stat) {
  if (typeof stat!=="string" || !stat) throw new Error("HAKODAN_DERIVED_DEPENDENCY_REQUIRED");
  definitionsAt(subject,definitionsPath);
  const value=resolveStat(subject,basePath,definitionsPath,equipmentPath,stat,[]);
  const definition=definitionsAt(subject,definitionsPath)?.[stat];
  return {stat,value,dependencies:orderedDependencies(definition?.dependsOn??[{stat}]).map(({dependency})=>clone(dependency))};
}
export function deriveStats(subject,basePath,definitionsPath,equipmentPath) {
  const definitions=definitionsAt(subject,definitionsPath);
  if (!definitions) throw new Error("HAKODAN_DERIVED_DEPENDENCY_REQUIRED");
  const result={};
  for (const stat of Object.keys(definitions).sort((a,b)=>a.localeCompare(b))) result[stat]=deriveStat(subject,basePath,definitionsPath,equipmentPath,stat);
  return result;
}
