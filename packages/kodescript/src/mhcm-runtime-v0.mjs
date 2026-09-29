function assertAst(ast) {
  if (!ast || ast.type !== 'world' || typeof ast.name !== 'string' || !Array.isArray(ast.entities)) {
    throw new TypeError('Invalid KODESCRIPT AST V0 world');
  }
}

export function lowerAstToIr(ast, provenance = []) {
  assertAst(ast);
  const instructions = [];

  for (const entity of ast.entities) {
    instructions.push({ op: 'ENTITY_DECLARE', target: entity.name });

    for (const property of entity.properties ?? []) {
      instructions.push({
        op: 'PROPERTY_SET',
        target: entity.name,
        key: property.name,
        value: property.value
      });
    }

    for (const event of entity.events ?? []) {
      instructions.push({ op: 'EVENT_DECLARE', target: `${entity.name}.${event.name}` });
      for (const action of event.actions ?? []) {
        instructions.push({
          op: 'ACTION_CALL',
          target: `${entity.name}.${action.name}`,
          args: action.args ?? []
        });
      }
    }
  }

  return {
    version: '0.1',
    world: ast.name,
    instructions,
    provenance: [...provenance]
  };
}

export function materializeRuntime(ir) {
  if (!ir || ir.version !== '0.1' || typeof ir.world !== 'string' || !Array.isArray(ir.instructions)) {
    throw new TypeError('Invalid HNK-IR V0');
  }

  const runtime = { world: ir.world, entities: {} };

  for (const instruction of ir.instructions) {
    if (instruction.op === 'ENTITY_DECLARE') {
      runtime.entities[instruction.target] ??= {
        properties: {},
        events: [],
        actionsCalled: []
      };
      continue;
    }

    const [entityName, memberName] = instruction.target.split('.', 2);
    const entity = runtime.entities[entityName];
    if (!entity) throw new Error(`Unknown runtime entity: ${entityName}`);

    if (instruction.op === 'PROPERTY_SET') {
      entity.properties[instruction.key] = instruction.value;
    } else if (instruction.op === 'EVENT_DECLARE') {
      entity.events.push(memberName);
    } else if (instruction.op === 'ACTION_CALL') {
      entity.actionsCalled.push(memberName);
    } else {
      throw new Error(`Unsupported HNK-IR operation: ${instruction.op}`);
    }
  }

  return runtime;
}
