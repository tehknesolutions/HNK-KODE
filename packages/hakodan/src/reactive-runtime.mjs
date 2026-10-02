function clone(value) { return structuredClone(value); }

export function createReactiveRuntime(ir) {
  if (ir?.ir !== "HNK-IR" || !ir?.world) throw new Error("HAKODAN_RUNTIME_INVALID_IR");

  const entities = new Map(ir.world.entities.map(entity => [entity.id, {
    id: entity.id,
    name: entity.name,
    state: {
      ...clone(entity.properties),
      position: { x: Number(entity.properties.x ?? 0), y: Number(entity.properties.y ?? 0) }
    }
  }]));

  const byName = new Map([...entities.values()].map(entity => [entity.name, entity]));

  function resolve(id) {
    const entity = entities.get(id);
    if (!entity) throw new Error(`HAKODAN_RUNTIME_UNKNOWN_ENTITY: ${id}`);
    return entity;
  }

  function evaluate(condition) {
    if (condition.kind !== "NEAR") throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_CONDITION: ${condition.kind}`);
    const subject = resolve(condition.subject).state.position;
    const target = resolve(condition.target).state.position;
    const dx = subject.x - target.x;
    const dy = subject.y - target.y;
    return Math.sqrt(dx * dx + dy * dy) <= condition.threshold;
  }

  function apply(action, transitions) {
    if (action.kind !== "SET") throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_ACTION: ${action.kind}`);
    const entity = resolve(action.subject);
    const before = entity.state[action.path];
    const after = clone(action.value);
    if (Object.is(before, after)) return;
    entity.state[action.path] = after;
    transitions.push({ entity: entity.name, path: action.path, before, after });
  }

  return {
    getEntity(name) {
      const entity = byName.get(name);
      if (!entity) throw new Error(`HAKODAN_RUNTIME_UNKNOWN_ENTITY_NAME: ${name}`);
      return clone(entity);
    },
    setPosition(name, position) {
      const entity = byName.get(name);
      if (!entity) throw new Error(`HAKODAN_RUNTIME_UNKNOWN_ENTITY_NAME: ${name}`);
      entity.state.position = { x: Number(position.x), y: Number(position.y) };
    },
    step() {
      const transitions = [];
      for (const rule of ir.world.rules ?? []) {
        if (rule.trigger !== "tick") throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_TRIGGER: ${rule.trigger}`);
        if (evaluate(rule.condition)) for (const action of rule.actions) apply(action, transitions);
      }
      return { transitions };
    }
  };
}
