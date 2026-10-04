function assertId(value, label) {
  if (typeof value !== "string" || !value) throw new Error(`HAKODAN_RELATION_INVALID_${label}`);
  return value;
}

function key(type, target) {
  return `${assertId(type, "TYPE")}\u0000${assertId(target, "TARGET")}`;
}

export function createRelationStore(entityExists) {
  const relations = new Map();

  function assertEntity(id) {
    assertId(id, "ENTITY");
    if (!entityExists(id)) throw new Error(`HAKODAN_RELATION_ENTITY_NOT_FOUND: ${id}`);
  }

  function bucket(subject) {
    assertEntity(subject);
    if (!relations.has(subject)) relations.set(subject, new Map());
    return relations.get(subject);
  }

  function has(subject, type, target) {
    assertEntity(subject); assertEntity(target);
    return relations.get(subject)?.has(key(type, target)) ?? false;
  }

  function add(subject, type, target) {
    assertEntity(subject); assertEntity(target);
    const map = bucket(subject); const relationKey = key(type, target);
    if (map.has(relationKey)) return null;
    const relation = { subject, type, target };
    map.set(relationKey, relation);
    return structuredClone(relation);
  }

  function remove(subject, type, target) {
    assertEntity(subject); assertEntity(target);
    const map = relations.get(subject); const relationKey = key(type, target);
    if (!map?.has(relationKey)) return null;
    const relation = structuredClone(map.get(relationKey));
    map.delete(relationKey);
    return relation;
  }

  function list(subject, type) {
    assertEntity(subject);
    const values = [...(relations.get(subject)?.values() ?? [])];
    return structuredClone(type === undefined ? values : values.filter(r => r.type === type));
  }

  return { has, add, remove, list };
}
