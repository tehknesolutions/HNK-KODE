import test from "node:test";
import assert from "node:assert/strict";
import { parse, toHnkIr } from "../src/parser.mjs";
import { createReactiveRuntime } from "../src/reactive-runtime.mjs";

const source = `mundo AbrasIsland {
  entidade Alakazam {
    propriedade x = 0;
    propriedade y = 0;
  }
  entidade Portal {
    propriedade x = 10;
    propriedade y = 0;
    propriedade open = false;
  }
  quando perto(Alakazam, Portal, 2) {
    ação definir(Portal, open, true);
  }
}`;

function runtime() {
  return createReactiveRuntime(toHnkIr(parse(source, { profile: "PT-BR" })));
}

test("V2-3 keeps Portal closed while Alakazam is outside threshold", () => {
  const rt = runtime();
  rt.step();
  assert.equal(rt.getEntity("Portal").state.open, false);
});

test("V2-3 NEAR + SET transitions Portal false -> true inside threshold", () => {
  const rt = runtime();
  rt.setPosition("Alakazam", { x: 8, y: 0 });
  const result = rt.step();
  assert.equal(result.transitions.length, 1);
  assert.deepEqual(result.transitions[0], { entity: "Portal", path: "open", before: false, after: true });
  assert.equal(rt.getEntity("Portal").state.open, true);
});

test("V2-3 repeated evaluation is deterministic and idempotent", () => {
  const rt = runtime();
  rt.setPosition("Alakazam", { x: 8, y: 0 });
  const first = rt.step();
  const second = rt.step();
  assert.equal(first.transitions.length, 1);
  assert.equal(second.transitions.length, 0);
  assert.equal(rt.getEntity("Portal").state.open, true);
});

test("V2-3 rejects unsupported runtime conditions explicitly", () => {
  const ir = toHnkIr(parse(source, { profile: "PT-BR" }));
  ir.world.rules[0].condition.kind = "UNKNOWN";
  const rt = createReactiveRuntime(ir);
  assert.throws(() => rt.step(), /HAKODAN_RUNTIME_UNSUPPORTED_CONDITION/);
});
