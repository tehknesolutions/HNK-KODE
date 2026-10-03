function assertTrigger(kind, handler) {
  if (typeof kind !== "string" || !kind) throw new Error("HAKODAN_TRIGGER_REGISTRY_INVALID_KIND");
  if (typeof handler !== "function") throw new Error(`HAKODAN_TRIGGER_REGISTRY_INVALID_HANDLER: ${kind}`);
}

export function createTriggerRegistry() {
  const handlers = new Map();
  return {
    register(kind, handler) {
      assertTrigger(kind, handler);
      if (handlers.has(kind)) throw new Error(`HAKODAN_TRIGGER_REGISTRY_DUPLICATE: ${kind}`);
      handlers.set(kind, handler);
      return this;
    },
    resolve(kind) {
      const handler = handlers.get(kind);
      if (!handler) throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_TRIGGER: ${kind}`);
      return handler;
    },
    has(kind) { return handlers.has(kind); },
    kinds() { return [...handlers.keys()]; }
  };
}

export function createCanonicalTriggerRegistry() {
  return createTriggerRegistry().register("tick", (_rule, event) => event.type === "tick");
}
