import { toHnkIr } from "./parser.mjs";

function emptyObjectBase({ id, name, type, provenance }) {
  return {
    identity: { id, name },
    type,
    state: {},
    properties: {},
    components: [],
    relations: [],
    behaviors: [],
    events: [],
    narrative: null,
    assets: [],
    presentation: null,
    data: {},
    manifestations: [],
    provenance
  };
}

export function toHom(ast) {
  const ir = toHnkIr(ast);
  const profile = ast.profile ?? "UNKNOWN";
  const world = emptyObjectBase({
    id: ir.world.id,
    name: ir.world.name,
    type: "World",
    provenance: { sourceProfile: profile, astKind: "WorldDeclaration", irVersion: ir.version }
  });

  world.components = ["World"];
  world.relations = ir.world.entities.map(entity => ({
    kind: "contains",
    target: entity.id
  }));

  world.events = ir.world.events.map(event => ({
    type: "Event",
    name: event.name,
    actions: event.actions.map(action => ({
      type: "Action",
      name: action.name,
      arguments: action.arguments
    }))
  }));

  const entities = ir.world.entities.map(entity => {
    const hom = emptyObjectBase({
      id: entity.id,
      name: entity.name,
      type: "Entity",
      provenance: { sourceProfile: profile, astKind: "EntityDeclaration", irVersion: ir.version }
    });
    hom.properties = { ...entity.properties };
    hom.components = ["Entity"];
    hom.relations = [{ kind: "containedBy", target: world.identity.id }];
    return hom;
  });

  return {
    model: "HOM",
    version: "0.1.0",
    root: world.identity.id,
    objects: [world, ...entities]
  };
}
