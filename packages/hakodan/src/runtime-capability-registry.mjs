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
      handlers.set(kind, handler);
      return this;
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
    const subject = context.entity(condition.subject);
    const target = context.entity(condition.target);
    return Math.hypot(subject.position.x - target.position.x, subject.position.y - target.position.y) <= condition.threshold;
  });

  conditions.register("EQUALS", (condition, context) => {
    const subject = context.entity(condition.subject);
    return Object.is(subject[condition.path], condition.value);
  });

  actions.register("SET", (action, context) => {
    const subject = context.entity(action.subject);
    const before = subject[action.path];
    if (Object.is(before, action.value)) return null;
    subject[action.path] = structuredClone(action.value);
    return { action: "SET", subject: action.subject, path: action.path, before, after: action.value };
  });

  actions.register("MOVE", (action, context) => {
    const subject = context.entity(action.subject);
    const before = structuredClone(subject.position);
    const after = { x: before.x + Number(action.dx ?? 0), y: before.y + Number(action.dy ?? 0) };
    if (Object.is(before.x, after.x) && Object.is(before.y, after.y)) return null;
    subject.position = after;
    return { action: "MOVE", subject: action.subject, path: "position", before, after: structuredClone(after) };
  });

  return { conditions, actions };
}
