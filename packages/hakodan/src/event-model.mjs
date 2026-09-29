import { TYPE_IDS, assertKnownType } from "./type-system.mjs";

export function defineAction({ id, name = id, arguments: args = [], returnType = TYPE_IDS.VOID }) {
  if (!id) throw new Error("HAKODAN_ACTION_ID_REQUIRED");
  assertKnownType(returnType);
  return Object.freeze({
    kind: "ActionDescriptor",
    id,
    name,
    arguments: args.map(arg => ({ ...arg })),
    returnType
  });
}

export function defineEvent({
  id,
  name = id,
  payloadType = TYPE_IDS.VOID,
  actions = [],
  provenance = null
}) {
  if (!id) throw new Error("HAKODAN_EVENT_ID_REQUIRED");
  assertKnownType(payloadType);
  return Object.freeze({
    kind: "EventDescriptor",
    id,
    name,
    payloadType,
    actions: actions.map(action => ({ ...action })),
    provenance
  });
}

export function eventFromIr(worldId, event, provenance = null) {
  const eventId = `${worldId}/event/${event.name}`;
  return defineEvent({
    id: eventId,
    name: event.name,
    actions: event.actions.map((action, index) => defineAction({
      id: `${eventId}/action/${index}-${action.name}`,
      name: action.name,
      arguments: action.arguments.map(value => ({ value }))
    })),
    provenance
  });
}
