import { assertAssignable, assertKnownType } from "./type-system.mjs";

export function defineComponent({
  id,
  name = id,
  version = "0.1.0",
  properties = {},
  events = [],
  behaviors = [],
  requires = []
}) {
  if (!id) throw new Error("HAKODAN_COMPONENT_ID_REQUIRED");

  const normalizedProperties = Object.fromEntries(
    Object.entries(properties).map(([key, typeId]) => [key, assertKnownType(typeId)])
  );

  return Object.freeze({
    kind: "ComponentDefinition",
    id,
    name,
    version,
    properties: normalizedProperties,
    events: [...events],
    behaviors: [...behaviors],
    requires: [...requires]
  });
}

export function attachComponent(homObject, definition, state = {}) {
  if (!homObject?.identity?.id) throw new Error("HAKODAN_COMPONENT_TARGET_INVALID");
  if (!definition?.id) throw new Error("HAKODAN_COMPONENT_DEFINITION_INVALID");

  const attachments = homObject.data?.componentAttachments ?? [];
  if (attachments.some(x => x.componentId === definition.id)) {
    throw new Error(`HAKODAN_COMPONENT_DUPLICATE: ${definition.id}`);
  }

  const present = new Set(attachments.map(x => x.componentId));
  for (const required of definition.requires) {
    if (!present.has(required)) throw new Error(`HAKODAN_COMPONENT_MISSING_DEPENDENCY: ${required}`);
  }

  for (const [key, value] of Object.entries(state)) {
    const expected = definition.properties[key];
    if (!expected) throw new Error(`HAKODAN_COMPONENT_UNKNOWN_PROPERTY: ${key}`);
    assertAssignable(value, expected);
  }

  const attachment = {
    componentId: definition.id,
    version: definition.version,
    state: { ...state }
  };

  homObject.data ??= {};
  homObject.data.componentAttachments = [...attachments, attachment];
  if (!homObject.components.includes(definition.id)) homObject.components.push(definition.id);
  return attachment;
}
