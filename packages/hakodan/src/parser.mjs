import { keywordMap } from "./semantic-tokens.mjs";

function tokenize(source, profile) {
  const keywords = keywordMap(profile);
  const raw = source.match(/"(?:\\.|[^"])*"|[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ0-9_-]*|\d+(?:\.\d+)?|[{}(),=;]/gu) ?? [];
  return raw.map(value => ({
    value,
    semantic: keywords.get(value) ?? null
  }));
}

function literal(token) {
  if (!token) throw new Error("HAKODAN_EXPECTED_LITERAL");
  if (token.value.startsWith('"')) return { kind: "StringLiteral", value: JSON.parse(token.value) };
  if (/^\d/.test(token.value)) return { kind: "NumberLiteral", value: Number(token.value) };
  if (token.value === "true" || token.value === "false") return { kind: "BooleanLiteral", value: token.value === "true" };
  return { kind: "IdentifierLiteral", value: token.value };
}

export function parse(source, { profile = "PT-BR" } = {}) {
  const tokens = tokenize(source, profile);
  let i = 0;
  const peek = () => tokens[i];
  const take = () => tokens[i++];
  const expectValue = value => {
    const t = take();
    if (!t || t.value !== value) throw new Error(`HAKODAN_EXPECTED_${value}: got ${t?.value ?? "EOF"}`);
    return t;
  };
  const expectSemantic = id => {
    const t = take();
    if (!t || t.semantic !== id) throw new Error(`HAKODAN_EXPECTED_${id}: got ${t?.value ?? "EOF"}`);
    return t;
  };
  const identifier = () => {
    const t = take();
    if (!t || t.semantic || /[{}(),=;]/.test(t.value)) throw new Error(`HAKODAN_EXPECTED_IDENTIFIER: got ${t?.value ?? "EOF"}`);
    return t.value;
  };

  function property() {
    expectSemantic("PROPERTY");
    const name = identifier();
    expectValue("=");
    const value = literal(take());
    if (peek()?.value === ";") take();
    return { kind: "PropertyDeclaration", name, value };
  }

  function action() {
    expectSemantic("ACTION");
    const name = identifier();
    expectValue("(");
    const args = [];
    while (peek() && peek().value !== ")") {
      args.push(literal(take()));
      if (peek()?.value === ",") take();
      else break;
    }
    expectValue(")");
    if (peek()?.value === ";") take();
    return { kind: "ActionDeclaration", name, arguments: args };
  }

  function event() {
    expectSemantic("EVENT");
    const name = identifier();
    expectValue("{");
    const actions = [];
    while (peek() && peek().value !== "}") actions.push(action());
    expectValue("}");
    return { kind: "EventDeclaration", name, actions };
  }

  function entity() {
    expectSemantic("ENTITY");
    const name = identifier();
    expectValue("{");
    const properties = [];
    while (peek() && peek().value !== "}") properties.push(property());
    expectValue("}");
    return { kind: "EntityDeclaration", name, properties };
  }

  expectSemantic("WORLD");
  const name = identifier();
  expectValue("{");
  const members = [];
  while (peek() && peek().value !== "}") {
    if (peek().semantic === "ENTITY") members.push(entity());
    else if (peek().semantic === "EVENT") members.push(event());
    else throw new Error(`HAKODAN_UNEXPECTED_TOKEN: ${peek().value}`);
  }
  expectValue("}");
  if (i !== tokens.length) throw new Error(`HAKODAN_TRAILING_TOKEN: ${peek()?.value}`);

  return { kind: "Program", profile, body: [{ kind: "WorldDeclaration", name, members }] };
}

export function canonicalizeAst(ast) {
  const clone = structuredClone(ast);
  delete clone.profile;
  return clone;
}

export function toHnkIr(ast) {
  const canonical = canonicalizeAst(ast);
  const world = canonical.body[0];
  return {
    ir: "HNK-IR",
    version: "0.1.0",
    world: {
      id: `hnk://world/${world.name}`,
      name: world.name,
      entities: world.members.filter(x => x.kind === "EntityDeclaration").map(entity => ({
        id: `hnk://world/${world.name}/entity/${entity.name}`,
        name: entity.name,
        properties: Object.fromEntries(entity.properties.map(p => [p.name, p.value.value]))
      })),
      events: world.members.filter(x => x.kind === "EventDeclaration").map(event => ({
        name: event.name,
        actions: event.actions.map(a => ({ name: a.name, arguments: a.arguments.map(x => x.value) }))
      }))
    }
  };
}
