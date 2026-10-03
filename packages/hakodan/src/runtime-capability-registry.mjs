function assertHandler(kind, handler, type) {
  if (typeof kind !== "string" || !kind) throw new Error(`HAKODAN_${type}_REGISTRY_INVALID_KIND`);
  if (typeof handler !== "function") throw new Error(`HAKODAN_${type}_REGISTRY_INVALID_HANDLER: ${kind}`);
}

function createRegistry(type) {
  const handlers = new Map();
  return {
    register(kind, handler) {
      assertHandler(kind, handler, type);
      if (handlers.has(kind)) throw new Error(`HAKODAN_${type}_REGISTRY_DUPLICATE: ${kind}`);
      handlers.set(kind, handler); return this;
    },
    resolve(kind) {
      const handler = handlers.get(kind);
      if (!handler) throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_${type}: ${kind}`);
      return handler;
    },
    has(kind) { return handlers.has(kind); },
    kinds() { return [...handlers.keys()]; }
  };
}

export function createConditionRegistry() { return createRegistry("CONDITION"); }
export function createActionRegistry() { return createRegistry("ACTION"); }

export function createCanonicalRuntimeRegistries() {
  const conditions = createConditionRegistry();
  const actions = createActionRegistry();

  conditions.register("NEAR", (condition, context) => {
    const subject = context.entity(condition.subject); const target = context.entity(condition.target);
    return Math.hypot(subject.position.x - target.position.x, subject.position.y - target.position.y) <= condition.threshold;
  });
  conditions.register("EQUALS", (condition, context) => Object.is(context.entity(condition.subject)[condition.path], condition.value));
  conditions.register("AND", (condition, context) => {
    if (!Array.isArray(condition.conditions) || condition.conditions.length === 0) throw new Error("HAKODAN_LOGIC_AND_REQUIRES_CONDITIONS");
    return condition.conditions.every(context.evaluate);
  });
  conditions.register("OR", (condition, context) => {
    if (!Array.isArray(condition.conditions) || condition.conditions.length === 0) throw new Error("HAKODAN_LOGIC_OR_REQUIRES_CONDITIONS");
    return condition.conditions.some(context.evaluate);
  });
  conditions.register("NOT", (condition, context) => {
    if (!condition.condition) throw new Error("HAKODAN_LOGIC_NOT_REQUIRES_CONDITION");
    return !context.evaluate(condition.condition);
  });

  actions.register("SET", (action, context) => {
    const subject = context.entity(action.subject); const before = subject[action.path];
    if (Object.is(before, action.value)) return null;
    subject[action.path] = structuredClone(action.value);
    return { action: "SET", subject: action.subject, path: action.path, before, after: action.value };
  });
  actions.register("MOVE", (action, context) => {
    const subject = context.entity(action.subject); const before = structuredClone(subject.position);
    const after = { x: before.x + Number(action.dx ?? 0), y: before.y + Number(action.dy ?? 0) };
    if (Object.is(before.x, after.x) && Object.is(before.y, after.y)) return null;
    subject.position = after;
    return { action: "MOVE", subject: action.subject, path: "position", before, after: structuredClone(after) };
  });
  return { conditions, actions };
}
