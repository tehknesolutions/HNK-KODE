import { getStatePath, setStatePath } from "./state-path.mjs";

function assertHandler(kind, handler, type) {
  if (typeof kind !== "string" || !kind) throw new Error(`HAKODAN_${type}_REGISTRY_INVALID_KIND`);
  if (typeof handler !== "function") throw new Error(`HAKODAN_${type}_REGISTRY_INVALID_HANDLER: ${kind}`);
}
function createRegistry(type) {
  const handlers = new Map();
  return {
    register(kind, handler) { assertHandler(kind, handler, type); if (handlers.has(kind)) throw new Error(`HAKODAN_${type}_REGISTRY_DUPLICATE: ${kind}`); handlers.set(kind, handler); return this; },
    resolve(kind) { const handler = handlers.get(kind); if (!handler) throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_${type}: ${kind}`); return handler; },
    has(kind) { return handlers.has(kind); }, kinds() { return [...handlers.keys()]; }
  };
}
function number(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`HAKODAN_NUMERIC_VALUE_REQUIRED: ${label}`);
  return value;
}
export function createConditionRegistry() { return createRegistry("CONDITION"); }
export function createActionRegistry() { return createRegistry("ACTION"); }
export function createCanonicalRuntimeRegistries() {
  const conditions = createConditionRegistry(); const actions = createActionRegistry();
  conditions.register("NEAR", (condition, context) => { const subject = context.entity(condition.subject); const target = context.entity(condition.target); return Math.hypot(subject.position.x - target.position.x, subject.position.y - target.position.y) <= condition.threshold; });
  conditions.register("EQUALS", (condition, context) => Object.is(getStatePath(context.entity(condition.subject), condition.path), condition.value));
  for (const [kind, compare] of [["GT", (a,b)=>a>b], ["GTE", (a,b)=>a>=b], ["LT", (a,b)=>a<b], ["LTE", (a,b)=>a<=b]]) {
    conditions.register(kind, (condition, context) => compare(number(getStatePath(context.entity(condition.subject), condition.path), `${condition.subject}.${condition.path}`), number(condition.value, `${kind}.value`)));
  }
  conditions.register("AND", (condition, context) => { if (!Array.isArray(condition.conditions) || condition.conditions.length === 0) throw new Error("HAKODAN_LOGIC_AND_REQUIRES_CONDITIONS"); return condition.conditions.every(context.evaluate); });
  conditions.register("OR", (condition, context) => { if (!Array.isArray(condition.conditions) || condition.conditions.length === 0) throw new Error("HAKODAN_LOGIC_OR_REQUIRES_CONDITIONS"); return condition.conditions.some(context.evaluate); });
  conditions.register("NOT", (condition, context) => { if (!condition.condition) throw new Error("HAKODAN_LOGIC_NOT_REQUIRES_CONDITION"); return !context.evaluate(condition.condition); });
  actions.register("SET", (action, context) => { const subject = context.entity(action.subject); const before = getStatePath(subject, action.path); if (Object.is(before, action.value)) return null; const change = setStatePath(subject, action.path, action.value); return { action: "SET", subject: action.subject, path: action.path, before: change.before, after: change.after }; });
  for (const [kind, operation] of [["ADD", (a,b)=>a+b], ["SUBTRACT", (a,b)=>a-b]]) {
    actions.register(kind, (action, context) => { const subject = context.entity(action.subject); const before = number(getStatePath(subject, action.path), `${action.subject}.${action.path}`); const operand = number(action.value, `${kind}.value`); const after = operation(before, operand); if (Object.is(before, after)) return null; setStatePath(subject, action.path, after); return { action: kind, subject: action.subject, path: action.path, before, after }; });
  }
  actions.register("MOVE", (action, context) => { const subject = context.entity(action.subject); const before = structuredClone(subject.position); const after = { x: before.x + Number(action.dx ?? 0), y: before.y + Number(action.dy ?? 0) }; if (Object.is(before.x, after.x) && Object.is(before.y, after.y)) return null; subject.position = after; return { action: "MOVE", subject: action.subject, path: "position", before, after: structuredClone(after) }; });
  return { conditions, actions };
}
