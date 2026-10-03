import { createCanonicalRuntimeRegistries } from "./runtime-capability-registry.mjs";
import { createCanonicalTriggerRegistry } from "./runtime-trigger-registry.mjs";
import { createRelationStore } from "./entity-relations.mjs";

function cloneEntity(entity) {
  return { id: entity.id, name: entity.name, ...structuredClone(entity.properties), position: { x: Number(entity.properties.x ?? 0), y: Number(entity.properties.y ?? 0) } };
}

export function createWorldRuntime(ir, options = {}) {
  if (ir?.ir !== "HNK-IR" || ir?.version !== "0.2.0" || !ir?.world) throw new Error("HAKODAN_WORLD_RUNTIME_INVALID_IR");
  const state = new Map(ir.world.entities.map(entity => [entity.id, cloneEntity(entity)]));
  const changes = [];
  const canonical = createCanonicalRuntimeRegistries();
  const conditions = options.conditions ?? canonical.conditions;
  const actions = options.actions ?? canonical.actions;
  const triggers = options.triggers ?? createCanonicalTriggerRegistry();
  const relations = createRelationStore(id => state.has(id));

  function entity(id) {
    const value = state.get(id);
    if (!value) throw new Error(`HAKODAN_RUNTIME_ENTITY_NOT_FOUND: ${id}`);
    return value;
  }
  const context = { entity, relations, evaluate: condition => evaluate(condition) };
  function evaluate(condition) { return Boolean(conditions.resolve(condition.kind)(condition, context)); }
  function apply(action, ruleId) {
    const change = actions.resolve(action.kind)(action, context);
    if (!change) return null;
    const evidence = { ruleId, ...change }; changes.push(evidence); return evidence;
  }
  function dispatch(event) {
    if (!event || typeof event.type !== "string" || !event.type) throw new Error("HAKODAN_RUNTIME_INVALID_EVENT");
    const applied = [];
    for (const rule of ir.world.rules ?? []) {
      if (!triggers.resolve(rule.trigger)(rule, event, context)) continue;
      if (!evaluate(rule.condition)) continue;
      for (const action of rule.actions) { const change = apply(action, rule.id); if (change) applied.push(change); }
    }
    return applied;
  }
  function tick() { return dispatch({ type: "tick" }); }
  function setPosition(entityId, x, y) { const subject = entity(entityId); subject.position = { x: Number(x), y: Number(y) }; return structuredClone(subject.position); }
  function snapshot() { return Object.fromEntries([...state.entries()].map(([id, value]) => [id, structuredClone(value)])); }
  return { tick, dispatch, setPosition, snapshot, changes, entity, relations, capabilities: { conditions, actions, triggers } };
}
