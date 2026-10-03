function cloneEntity(entity) {
  return {
    id: entity.id,
    name: entity.name,
    ...structuredClone(entity.properties),
    position: {
      x: Number(entity.properties.x ?? 0),
      y: Number(entity.properties.y ?? 0)
    }
  };
}

export function createWorldRuntime(ir) {
  if (ir?.ir !== "HNK-IR" || ir?.version !== "0.2.0" || !ir?.world) {
    throw new Error("HAKODAN_WORLD_RUNTIME_INVALID_IR");
  }

  const state = new Map(ir.world.entities.map(entity => [entity.id, cloneEntity(entity)]));
  const changes = [];

  function entity(id) {
    const value = state.get(id);
    if (!value) throw new Error(`HAKODAN_RUNTIME_ENTITY_NOT_FOUND: ${id}`);
    return value;
  }

  function evaluate(condition) {
    if (condition.kind === "NEAR") {
      const subject = entity(condition.subject);
      const target = entity(condition.target);
      return Math.hypot(
        subject.position.x - target.position.x,
        subject.position.y - target.position.y
      ) <= condition.threshold;
    }
    throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_CONDITION: ${condition.kind}`);
  }

  function apply(action, ruleId) {
    if (action.kind !== "SET") throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_ACTION: ${action.kind}`);
    const subject = entity(action.subject);
    const before = subject[action.path];
    if (Object.is(before, action.value)) return null;
    subject[action.path] = structuredClone(action.value);
    const change = { ruleId, action: "SET", subject: action.subject, path: action.path, before, after: action.value };
    changes.push(change);
    return change;
  }

  function tick() {
    const applied = [];
    for (const rule of ir.world.rules ?? []) {
      if (rule.trigger !== "tick") throw new Error(`HAKODAN_RUNTIME_UNSUPPORTED_TRIGGER: ${rule.trigger}`);
      if (!evaluate(rule.condition)) continue;
      for (const action of rule.actions) {
        const change = apply(action, rule.id);
        if (change) applied.push(change);
      }
    }
    return applied;
  }

  function setPosition(entityId, x, y) {
    const subject = entity(entityId);
    subject.position = { x: Number(x), y: Number(y) };
    return structuredClone(subject.position);
  }

  function snapshot() {
    return Object.fromEntries([...state.entries()].map(([id, value]) => [id, structuredClone(value)]));
  }

  return { tick, setPosition, snapshot, changes, entity };
}
