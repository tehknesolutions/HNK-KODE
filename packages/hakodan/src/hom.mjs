import { toHnkIr } from "./parser.mjs";
import { eventFromIr } from "./event-model.mjs";

function emptyObjectBase({ id, name, type, provenance }) {
  return { identity: { id, name }, type, state: {}, properties: {}, components: [], relations: [], behaviors: [], events: [], narrative: null, assets: [], presentation: null, data: {}, manifestations: [], provenance };
}

export function toHom(ast) {
  const ir = toHnkIr(ast);
  const profile = ast.profile ?? "UNKNOWN";
  const world = emptyObjectBase({ id: ir.world.id, name: ir.world.name, type: "World", provenance: { sourceProfile: profile, astKind: "WorldDeclaration", irVersion: ir.version } });
  world.components = ["World"];
  world.relations = ir.world.entities.map(entity => ({ kind: "contains", target: entity.id }));
  world.events = ir.world.events.map(event => eventFromIr(ir.world.id, event, { sourceProfile: profile, astKind: "EventDeclaration", irVersion: ir.version }));
  world.behaviors = (ir.world.rules ?? []).map(rule => ({
    kind: "ReactiveRule", id: rule.id, trigger: rule.trigger,
    condition: structuredClone(rule.condition), actions: structuredClone(rule.actions),
    provenance: { sourceProfile: profile, astKind: "WhenDeclaration", irVersion: ir.version }
  }));

  const entities = ir.world.entities.map(entity => {
    const hom = emptyObjectBase({ id: entity.id, name: entity.name, type: "Entity", provenance: { sourceProfile: profile, astKind: "EntityDeclaration", irVersion: ir.version } });
    hom.properties = { ...entity.properties };
    hom.data.propertyTypes = { ...(entity.propertyTypes ?? {}) };
    hom.components = ["Entity"];
    hom.relations = [{ kind: "containedBy", target: world.identity.id }];
    return hom;
  });
  return { model: "HOM", version: "0.2.0", root: world.identity.id, objects: [world, ...entities] };
}
