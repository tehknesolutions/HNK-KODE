import { getStatePath } from "./state-path.mjs";
import { deriveStat as deriveEquipmentStat } from "./equipment-effects-state.mjs";
import { evaluateFormula } from "./derived-formula-state.mjs";

const OPS=new Set(["ADD","SUBTRACT"]);
function clone(v){return structuredClone(v);}
function numeric(v,label){if(typeof v!=="number"||!Number.isFinite(v))throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NUMERIC_REQUIRED: ${label}`);return v;}
function orderedDependencies(ds){return ds.map((dependency,index)=>({dependency,index})).sort((a,b)=>String(a.dependency?.stat??"").localeCompare(String(b.dependency?.stat??""))||a.index-b.index);}
function definitionsAt(subject,path){const d=getStatePath(subject,path);if(d===undefined||d===null)return undefined;if(typeof d!=="object"||Array.isArray(d))throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");return d;}
function validateDependency(d){if(!d||typeof d!=="object"||Array.isArray(d)||typeof d.stat!=="string"||!d.stat)throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");const hasOp=d.op!==undefined,hasValue=d.value!==undefined;if(hasOp!==hasValue||(hasOp&&!OPS.has(d.op)))throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");if(hasValue)numeric(d.value,d.stat);}
function resolveResult(subject,basePath,definitionsPath,equipmentPath,stat,trail){
 if(trail.includes(stat))throw new Error(`HAKODAN_DERIVED_CYCLE: ${[...trail,stat].join("->")}`);
 const base=getStatePath(subject,basePath),definitions=definitionsAt(subject,definitionsPath),definition=definitions?.[stat];
 const hasBase=Boolean(base&&typeof base==="object"&&!Array.isArray(base)&&Object.prototype.hasOwnProperty.call(base,stat));
 if(definition===undefined){if(!hasBase)throw new Error(`HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: ${stat}`);const equipment=deriveEquipmentStat(subject,basePath,equipmentPath,stat);return{stat,value:equipment.value,dependencies:[{stat}],equipment};}
 if(!definition||typeof definition!=="object"||Array.isArray(definition))throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
 const hasFormula=Object.prototype.hasOwnProperty.call(definition,"formula"),hasDepends=Object.prototype.hasOwnProperty.call(definition,"dependsOn");
 if(Number(hasFormula)+Number(hasDepends)!==1)throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
 const nextTrail=[...trail,stat];
 if(hasFormula){
   const formula=evaluateFormula(definition.formula,{resolveStat:ref=>resolveResult(subject,basePath,definitionsPath,equipmentPath,ref,nextTrail).value});
   return{stat,value:formula.value,formula};
 }
 if(!Array.isArray(definition.dependsOn)||definition.dependsOn.length===0)throw new Error("HAKODAN_DERIVED_DEPENDENCY_INVALID");
 let value;
 const dependencies=orderedDependencies(definition.dependsOn).map(({dependency})=>clone(dependency));
 for(const dependency of dependencies){validateDependency(dependency);const dependencyValue=resolveResult(subject,basePath,definitionsPath,equipmentPath,dependency.stat,nextTrail).value;if(value===undefined)value=dependencyValue;else if(dependency.op===undefined)value+=dependencyValue;if(dependency.op==="ADD")value+=dependency.value;if(dependency.op==="SUBTRACT")value-=dependency.value;}
 return{stat,value:numeric(value,stat),dependencies};
}
export function deriveStat(subject,basePath,definitionsPath,equipmentPath,stat){if(typeof stat!=="string"||!stat)throw new Error("HAKODAN_DERIVED_DEPENDENCY_REQUIRED");definitionsAt(subject,definitionsPath);return resolveResult(subject,basePath,definitionsPath,equipmentPath,stat,[]);}
export function deriveStats(subject,basePath,definitionsPath,equipmentPath){const definitions=definitionsAt(subject,definitionsPath);if(!definitions)throw new Error("HAKODAN_DERIVED_DEPENDENCY_REQUIRED");const result={};for(const stat of Object.keys(definitions).sort((a,b)=>a.localeCompare(b)))result[stat]=deriveStat(subject,basePath,definitionsPath,equipmentPath,stat);return result;}
