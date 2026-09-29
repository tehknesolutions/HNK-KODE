import test from "node:test";
import assert from "node:assert/strict";
import { createReactiveGraph, registerDependency, planImpact, traceCause } from "../src/reactive-living-graph-v0.9.mjs";

test("RLG registers explicit STATE SIGNAL EVENT FLOW EFFECT WATCH dependencies", () => {
  let graph = createReactiveGraph();
  for (const [from, to, kind] of [
    ["STATE.PlayerHealth", "SIGNAL.HealthChanged", "SIGNAL"],
    ["SIGNAL.HealthChanged", "EVENT.PlayerDead", "EVENT"],
    ["EVENT.PlayerDead", "FLOW.Respawn", "FLOW"],
    ["FLOW.Respawn", "EFFECT.RenderRespawn", "EFFECT"],
    ["WATCH.GarukanClass", "EFFECT.CharacterSheet", "WATCH"]
  ]) graph = registerDependency(graph, from, to, { kind });
  const impact = planImpact(graph, "STATE.PlayerHealth");
  assert.deepEqual(impact.nodes, ["SIGNAL.HealthChanged", "EVENT.PlayerDead", "FLOW.Respawn", "EFFECT.RenderRespawn"]);
});

test("traceCause returns an explicit causal path", () => {
  let graph = registerDependency(createReactiveGraph(), "STATE.A", "EVENT.B", { kind: "EVENT" });
  graph = registerDependency(graph, "EVENT.B", "EFFECT.C", { kind: "EFFECT" });
  assert.deepEqual(traceCause(graph, "STATE.A", "EFFECT.C"), ["STATE.A", "EVENT.B", "EFFECT.C"]);
});

test("dependency cycles diagnose instead of recursing forever", () => {
  let graph = registerDependency(createReactiveGraph(), "STATE.A", "EVENT.B", { kind: "EVENT" });
  graph = registerDependency(graph, "EVENT.B", "STATE.A", { kind: "STATE" });
  const impact = planImpact(graph, "STATE.A");
  assert.equal(impact.valid, false);
  assert.match(impact.diagnostics[0], /HAKODAN_V09_REACTIVE_CYCLE/);
});

test("policy can gate an effect from impact planning", () => {
  let graph = registerDependency(createReactiveGraph(), "STATE.A", "EFFECT.B", { kind: "EFFECT", policy: "APPROVAL_REQUIRED" });
  const blocked = planImpact(graph, "STATE.A", { approvedPolicies: [] });
  assert.deepEqual(blocked.nodes, []);
  assert.deepEqual(blocked.pending, ["EFFECT.B"]);
  const approved = planImpact(graph, "STATE.A", { approvedPolicies: ["APPROVAL_REQUIRED"] });
  assert.deepEqual(approved.nodes, ["EFFECT.B"]);
});
