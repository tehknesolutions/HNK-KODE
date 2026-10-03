import { getStatePath, setStatePath } from "./state-path.mjs";
import { collectionHas, collectionCount, addCollectionItem, removeCollectionItem } from "./collection-state.mjs";

function assertHandler(kind, handler, type) { if (typeof kind !== "string" || !kind) throw new Error(`HAKODAN_${type}_REGISTRY_INVALID_KIND`); if (typeof handler !== "function") throw new Error(`HAKODAN_${type}_REGISTRY_INVALID_HANDLER: ${kind}`); }
function createRegistry(type) { const handlers = new Map(); return { register(kind, handler) { assertHandler(kind, handler, type); if (handlers.has(kind)) throw new Error(`HAKODAN_${type}_REGISTRY_DUPLICATE: ${kind}`); handlers.set(kind, handler); return this; }, resolve(kind) { const handler = handlers.get(kind); if (!handler) throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_${type}: ${kind}`); return handler; }, has(kind) { return handlers.has(kind); }, kinds() { return [...handlers.keys()]; } }; }
function number(value, label) { if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`HAKODAN_NUMERIC_VALUE_REQUIRED: ${label}`); return value; }
function bounded(value, min, max) { const low = min === undefined ? -Infinity : number(min, "CLAMP.min"); const high = max === undefined ? Infinity : number(max, "CLAMP.max"); if (low > high) throw new Error("HAKODAN_NUMERIC_INVALID_BOUNDS"); return Math.min(high, Math.max(low, value)); }
export function createConditionRegistry() { return createRegistry("CONDITION"); }
export function createActionRegistry() { return createRegistry("ACTION"); }
export function createCanonicalRuntimeRegistries() {
  const conditions = createConditionRegistry(); const actions = createActionRegistry();
  conditions.register("NEAR", (c,x) => { const a=x.entity(c.subject), b=x.entity(c.target); return Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y)<=c.threshold; });
  conditions.register("EQUALS", (c,x) => Object.is(getStatePath(x.entity(c.subject),c.path),c.value));
  for (const [k,f] of [["GT",(a,b)=>a>b],["GTE",(a,b)=>a>=b],["LT",(a,b)=>a<b],["LTE",(a,b)=>a<=b]]) conditions.register(k,(c,x)=>f(number(getStatePath(x.entity(c.subject),c.path),`${c.subject}.${c.path}`),number(c.value,`${k}.value`)));
  conditions.register("HAS", (c,x) => collectionHas(x.entity(c.subject),c.path,c.value));
  conditions.register("COUNT", (c,x) => collectionCount(x.entity(c.subject),c.path,c.value) === number(c.count,"COUNT.count"));
  conditions.register("AND",(c,x)=>{if(!Array.isArray(c.conditions)||!c.conditions.length)throw new Error("HAKODAN_LOGIC_AND_REQUIRES_CONDITIONS");return c.conditions.every(x.evaluate);});
  conditions.register("OR",(c,x)=>{if(!Array.isArray(c.conditions)||!c.conditions.length)throw new Error("HAKODAN_LOGIC_OR_REQUIRES_CONDITIONS");return c.conditions.some(x.evaluate);});
  conditions.register("NOT",(c,x)=>{if(!c.condition)throw new Error("HAKODAN_LOGIC_NOT_REQUIRES_CONDITION");return !x.evaluate(c.condition);});
  actions.register("SET",(a,x)=>{const s=x.entity(a.subject),before=getStatePath(s,a.path);if(Object.is(before,a.value))return null;const change=setStatePath(s,a.path,a.value);return{action:"SET",subject:a.subject,path:a.path,before:change.before,after:change.after};});
  for(const[k,f]of[["ADD",(a,b)=>a+b],["SUBTRACT",(a,b)=>a-b]])actions.register(k,(a,x)=>{const s=x.entity(a.subject),before=number(getStatePath(s,a.path),`${a.subject}.${a.path}`),after=f(before,number(a.value,`${k}.value`));if(Object.is(before,after))return null;setStatePath(s,a.path,after);return{action:k,subject:a.subject,path:a.path,before,after};});
  actions.register("CLAMP",(a,x)=>{const s=x.entity(a.subject),before=number(getStatePath(s,a.path),`${a.subject}.${a.path}`),after=bounded(before,a.min,a.max);if(Object.is(before,after))return null;setStatePath(s,a.path,after);return{action:"CLAMP",subject:a.subject,path:a.path,before,after};});
  for(const[k,sign]of[["ADD_CLAMPED",1],["SUBTRACT_CLAMPED",-1]])actions.register(k,(a,x)=>{const s=x.entity(a.subject),before=number(getStatePath(s,a.path),`${a.subject}.${a.path}`),after=bounded(before+sign*number(a.value,`${k}.value`),a.min,a.max);if(Object.is(before,after))return null;setStatePath(s,a.path,after);return{action:k,subject:a.subject,path:a.path,before,after};});
  actions.register("PUSH",(a,x)=>{const change=addCollectionItem(x.entity(a.subject),a.path,a.value);return{action:"PUSH",subject:a.subject,path:a.path,before:change.before,after:change.after};});
  actions.register("REMOVE",(a,x)=>{const change=removeCollectionItem(x.entity(a.subject),a.path,a.value,Boolean(a.all));if(!change)return null;return{action:"REMOVE",subject:a.subject,path:a.path,before:change.before,after:change.after};});
  actions.register("MOVE",(a,x)=>{const s=x.entity(a.subject),before=structuredClone(s.position),after={x:before.x+Number(a.dx??0),y:before.y+Number(a.dy??0)};if(Object.is(before.x,after.x)&&Object.is(before.y,after.y))return null;s.position=after;return{action:"MOVE",subject:a.subject,path:"position",before,after:structuredClone(after)};});
  return { conditions, actions };
}
