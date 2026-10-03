import test from "node:test";
import assert from "node:assert/strict";
import { buildGoldenPath } from "../src/golden-path-v1.mjs";
import { projectStudioInspector } from "../src/studio-inspector-v1.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;

const en = `world AbraIsland {
  entity Alakazam { property vida = 100 }
  event Despertar { action despertar("Alakazam") }
}`;

test("PT-BR and EN project identical canonical inspector data", () => {
  const a = projectStudioInspector(buildGoldenPath(pt, { profile: "PT-BR" }));
  const b = projectStudioInspector(buildGoldenPath(en, { profile: "EN" }));
  assert.deepEqual(a, b);
  assert.equal(a.world, "AbraIsland");
  assert.deepEqual(a.entities, ["Alakazam"]);
  assert.deepEqual(a.properties, [{ entity: "Alakazam", name: "vida", value: 100 }]);
  assert.deepEqual(a.events, ["Despertar"]);
  assert.deepEqual(a.actions, [{ event: "Despertar", name: "despertar", args: ["Alakazam"] }]);
});

test("invalid input fails closed", () => {
  assert.throws(() => projectStudioInspector(null), /HAKODAN_STUDIO_INSPECTOR_INVALID/);
  assert.throws(() => projectStudioInspector({ ir: {} }), /HAKODAN_STUDIO_INSPECTOR_INVALID/);
});
