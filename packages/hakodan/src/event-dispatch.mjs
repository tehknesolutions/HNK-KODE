import { assertAssignable, TYPE_IDS } from "./type-system.mjs";

export function buildEventIndex(hom) {
  const index = new Map();
  for (const object of hom.objects) {
    for (const event of object.events ?? []) {
      if (index.has(event.id)) throw new Error(`HAKODAN_EVENT_DUPLICATE: ${event.id}`);
      index.set(event.id, { owner: object.identity.id, event });
    }
  }
  return index;
}

export function planDispatch(hom, eventId, payload = undefined) {
  const index = buildEventIndex(hom);
  const record = index.get(eventId);
  if (!record) throw new Error(`HAKODAN_EVENT_NOT_FOUND: ${eventId}`);

  const expected = record.event.payloadType ?? TYPE_IDS.VOID;
  if (expected === TYPE_IDS.VOID) {
    if (payload !== undefined) throw new Error("HAKODAN_EVENT_UNEXPECTED_PAYLOAD");
  } else {
    assertAssignable(payload, expected);
  }

  return {
    kind: "EventDispatchPlan",
    eventId,
    owner: record.owner,
    payloadType: expected,
    payload,
    steps: record.event.actions.map((action, index) => ({
      order: index,
      actionId: action.id,
      name: action.name,
      arguments: action.arguments.map(arg => ({ ...arg })),
      returnType: action.returnType
    }))
  };
}


export function buildEventCatalog(hom) {
  const rows = [];
  for (const object of [...hom.objects].sort((a,b)=>a.identity.id.localeCompare(b.identity.id))) {
    for (const event of [...(object.events ?? [])].sort((a,b)=>a.id.localeCompare(b.id))) {
      rows.push({
        index: rows.length,
        eventId: event.id,
        owner: object.identity.id,
        payloadType: event.payloadType,
        actions: event.actions.map((action, order) => ({
          order,
          actionId: action.id,
          name: action.name,
          returnType: action.returnType
        }))
      });
    }
  }
  return rows;
}
