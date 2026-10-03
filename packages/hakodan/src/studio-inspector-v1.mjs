function freezeList(items) {
  return Object.freeze(items.map(item =>
    item && typeof item === "object" ? Object.freeze(item) : item
  ));
}

export function projectStudioInspector(goldenPath) {
  const world = goldenPath?.ir?.world;
  if (!world || !Array.isArray(world.entities) || !Array.isArray(world.events)) {
    throw new Error("HAKODAN_STUDIO_INSPECTOR_INVALID");
  }

  const entities = [];
  const properties = [];
  const events = [];
  const actions = [];

  for (const entity of world.entities) {
    if (!entity?.name || !entity.properties || typeof entity.properties !== "object") {
      throw new Error("HAKODAN_STUDIO_INSPECTOR_INVALID");
    }
    entities.push(entity.name);
    for (const [name, value] of Object.entries(entity.properties)) {
      properties.push({ entity: entity.name, name, value });
    }
  }

  for (const event of world.events) {
    if (!event?.name || !Array.isArray(event.actions)) {
      throw new Error("HAKODAN_STUDIO_INSPECTOR_INVALID");
    }
    events.push(event.name);
    for (const action of event.actions) {
      if (!action?.name || !Array.isArray(action.arguments)) {
        throw new Error("HAKODAN_STUDIO_INSPECTOR_INVALID");
      }
      actions.push(Object.freeze({
        event: event.name,
        name: action.name,
        args: Object.freeze([...action.arguments])
      }));
    }
  }

  return Object.freeze({
    world: world.name,
    entities: freezeList(entities),
    properties: freezeList(properties),
    events: freezeList(events),
    actions: Object.freeze(actions)
  });
}
