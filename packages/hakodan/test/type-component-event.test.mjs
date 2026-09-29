import test from "node:test";
import assert from "node:assert/strict";
import { TYPE_IDS, inferLiteralType, isAssignable, assertAssignable } from "../src/type-system.mjs";
import { defineComponent, attachComponent } from "../src/component-model.mjs";
import { defineEvent, defineAction, eventFromIr } from "../src/event-model.mjs";
import { parse, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";

test("Type System infere literais e não faz coerção silenciosa", () => {
  assert.equal(inferLiteralType({ kind: "NumberLiteral", value: 7 }), TYPE_IDS.NUMBER);
  assert.equal(inferLiteralType({ kind: "StringLiteral", value: "7" }), TYPE_IDS.STRING);
  assert.equal(isAssignable(TYPE_IDS.NUMBER, TYPE_IDS.ANY), true);
  assert.equal(isAssignable(TYPE_IDS.NUMBER, TYPE_IDS.STRING), false);
  assert.throws(() => assertAssignable(7, TYPE_IDS.STRING), /TYPE_MISMATCH/);
});

test("Component Model valida estado e duplicidade", () => {
  const hom = toHom(parse("mundo W { entidade E { propriedade vida = 100 } }", { profile: "PT-BR" }));
  const entity = hom.objects.find(x => x.type === "Entity");
  const health = defineComponent({
    id: "hnk.component.Health",
    properties: { current: TYPE_IDS.NUMBER }
  });

  const attachment = attachComponent(entity, health, { current: 100 });
  assert.equal(attachment.componentId, "hnk.component.Health");
  assert.ok(entity.components.includes("hnk.component.Health"));
  assert.throws(() => attachComponent(entity, health, { current: 100 }), /COMPONENT_DUPLICATE/);
});

test("Component Model rejeita estado incompatível", () => {
  const hom = toHom(parse("world W { entity E { property vida = 100 } }", { profile: "EN" }));
  const entity = hom.objects.find(x => x.type === "Entity");
  const health = defineComponent({
    id: "hnk.component.Health",
    properties: { current: TYPE_IDS.NUMBER }
  });
  assert.throws(() => attachComponent(entity, health, { current: "100" }), /TYPE_MISMATCH/);
});

test("Event Model cria IDs determinísticos sobre HNK-IR", () => {
  const ir = toHnkIr(parse('mundo W { evento Start { ação run("E") } }', { profile: "PT-BR" }));
  const event = eventFromIr(ir.world.id, ir.world.events[0], { sourceProfile: "PT-BR" });
  assert.equal(event.id, "hnk://world/W/event/Start");
  assert.equal(event.actions[0].id, "hnk://world/W/event/Start/action/0-run");
  assert.equal(event.payloadType, TYPE_IDS.VOID);
});

test("Event e Action descriptors usam tipos semânticos", () => {
  const action = defineAction({ id: "a", returnType: TYPE_IDS.BOOLEAN });
  const event = defineEvent({ id: "e", payloadType: TYPE_IDS.STRING, actions: [action] });
  assert.equal(event.payloadType, "String");
  assert.equal(event.actions[0].returnType, "Boolean");
});
