import test from "node:test";
import assert from "node:assert/strict";
import { deriveStat, deriveStats } from "../src/derived-dependency-state.mjs";

const baseSubject = () => ({
  stats: {
    base: { attack: 10, strength: 4 },
    definitions: {
      power: { dependsOn: [{ stat: "attack" }, { stat: "strength", op: "ADD", value: 2 }] }
    }
  },
  equipment: { main_hand: null }
});

test("V2-22 derives a stat from deterministic base dependencies without mutation", () => {
  const s = baseSubject();
  const before = structuredClone(s.stats.base);
  const result = deriveStat(s, "stats.base", "stats.definitions", "equipment", "power");
  assert.equal(result.value, 16);
  assert.deepEqual(s.stats.base, before);
});

test("V2-22 dependency evaluation is independent of definition insertion order", () => {
  const s = baseSubject();
  s.stats.definitions.power.dependsOn = [{ stat: "strength", op: "ADD", value: 2 }, { stat: "attack" }];
  const result = deriveStat(s, "stats.base", "stats.definitions", "equipment", "power");
  assert.equal(result.value, 16);
  assert.deepEqual(result.dependencies.map(x => x.stat), ["attack", "strength"]);
});

test("V2-22 multiple dependency operations compose deterministically", () => {
  const s = baseSubject();
  s.stats.definitions.power.dependsOn = [{ stat: "attack" }, { stat: "strength", op: "ADD", value: 2 }, { stat: "attack", op: "SUBTRACT", value: 3 }];
  const result = deriveStat(s, "stats.base", "stats.definitions", "equipment", "power");
  assert.equal(result.value, 13);
});

test("V2-22 missing dependency rejects explicitly", () => {
  const s = baseSubject();
  s.stats.definitions.power.dependsOn = [{ stat: "missing" }];
  assert.throws(() => deriveStat(s, "stats.base", "stats.definitions", "equipment", "power"), /HAKODAN_DERIVED_DEPENDENCY_NOT_FOUND: missing/);
});

test("V2-22 invalid dependency schema rejects explicitly", () => {
  const s = baseSubject();
  s.stats.definitions.power.dependsOn = [{ stat: "attack", op: "ADD" }];
  assert.throws(() => deriveStat(s, "stats.base", "stats.definitions", "equipment", "power"), /HAKODAN_DERIVED_DEPENDENCY_INVALID/);
});

test("V2-22 derived dependency resolves another derived stat before composition", () => {
  const s = baseSubject();
  s.stats.definitions = {
    power: { dependsOn: [{ stat: "attack" }, { stat: "strength", op: "ADD", value: 2 }] },
    combat: { dependsOn: [{ stat: "power" }, { stat: "strength", op: "ADD", value: 1 }] }
  };
  const result = deriveStat(s, "stats.base", "stats.definitions", "equipment", "combat");
  assert.equal(result.value, 17);
});

test("V2-22 cyclic dependency rejects with canonical cycle error", () => {
  const s = baseSubject();
  s.stats.definitions = {
    power: { dependsOn: [{ stat: "combat" }] },
    combat: { dependsOn: [{ stat: "power" }] }
  };
  assert.throws(() => deriveStat(s, "stats.base", "stats.definitions", "equipment", "power"), /HAKODAN_DERIVED_CYCLE: power->combat->power/);
});

test("V2-22 nonnumeric dependency value rejects explicitly", () => {
  const s = baseSubject();
  s.stats.definitions.power.dependsOn = [{ stat: "strength", op: "ADD", value: "2" }];
  assert.throws(() => deriveStat(s, "stats.base", "stats.definitions", "equipment", "power"), /HAKODAN_DERIVED_DEPENDENCY_NUMERIC_REQUIRED: strength/);
});

test("V2-22 deriveStats resolves declared derived definitions in canonical order", () => {
  const s = baseSubject();
  s.stats.definitions = {
    combat: { dependsOn: [{ stat: "power" }, { stat: "strength" }] },
    power: { dependsOn: [{ stat: "attack" }, { stat: "strength" }] }
  };
  const result = deriveStats(s, "stats.base", "stats.definitions", "equipment");
  assert.deepEqual(Object.keys(result), ["combat", "power"]);
  assert.equal(result.power.value, 14);
  assert.equal(result.combat.value, 18);
});
