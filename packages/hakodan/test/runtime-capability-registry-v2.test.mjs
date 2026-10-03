import test from "node:test";
import assert from "node:assert/strict";
import { createConditionRegistry, createActionRegistry, createCanonicalRuntimeRegistries } from "../src/runtime-capability-registry.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

test("V2-8 canonical registries expose NEAR and SET", () => {
  const { conditions, actions } = createCanonicalRuntimeRegistries();
  assert.deepEqual(conditions.kinds(), ["NEAR"]);
  assert.deepEqual(actions.kinds(), ["SET"]);
});

test("V2-8 registries reject duplicates and unsupported capabilities explicitly", () => {
  const conditions = createConditionRegistry().register("ALWAYS", () => true);
  assert.throws(() => conditions.register("ALWAYS", () => true), /HAKODAN_CONDITION_REGISTRY_DUPLICATE/);
  assert.throws(() => conditions.resolve("UNKNOWN"), /HAKODAN_RUNTIME_UNSUPPORTED_CONDITION/);
  const actions = createActionRegistry();
  assert.throws(() => actions.resolve("UNKNOWN"), /HAKODAN_RUNTIME_UNSUPPORTED_ACTION/);
});

test("V2-8 world runtime accepts injected condition/action capabilities", () => {
  const conditions = createConditionRegistry().register("ALWAYS", () => true);
  const actions = createActionRegistry().register("MARK", (action, context) => {
    const subject = context.entity(action.subject);
    const before = subject[action.path];
    subject[action.path] = action.value;
    return { action: "MARK", subject: action.subject, path: action.path, before, after: action.value };
  });
  const ir = {
    ir: "HNK-IR", version: "0.2.0",
    world: {
      entities: [{ id: "e1", name: "Portal", properties: { open: false } }],
      rules: [{ id: "r1", trigger: "tick", condition: { kind: "ALWAYS" }, actions: [{ kind: "MARK", subject: "e1", path: "open", value: true }] }]
    }
  };
  const runtime = createWorldRuntime(ir, { conditions, actions });
  assert.deepEqual(runtime.tick(), [{ ruleId: "r1", action: "MARK", subject: "e1", path: "open", before: false, after: true }]);
  assert.equal(runtime.entity("e1").open, true);
});
