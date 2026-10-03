import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createStudioSession } from "../src/studio-session-v1.mjs";
import { projectStudioInspector } from "../src/studio-inspector-v1.mjs";

const fixtureBase = new URL("../examples/golden-path-web/", import.meta.url);

async function load(name) {
  return readFile(new URL(name, fixtureBase), "utf8");
}

test("Studio PT-BR and EN converge through canonical validate/run loop", async () => {
  const pt = createStudioSession({ source: await load("abra-island.pt.hnk"), profile: "PT-BR" });
  const en = createStudioSession({ source: await load("abra-island.en.hnk"), profile: "EN" });

  const ptValidated = pt.validate();
  const enValidated = en.validate();
  assert.equal(ptValidated.status, "VALID");
  assert.equal(enValidated.status, "VALID");
  assert.deepEqual(projectStudioInspector(ptValidated.goldenPath), projectStudioInspector(enValidated.goldenPath));

  const a = pt.run();
  const b = en.run();
  assert.equal(a.status, "ARTIFACT_GENERATED");
  assert.equal(a.artifact.executionEvidence, "UNVERIFIED");
  assert.equal(a.artifact.content, b.artifact.content);
});

test("Studio failure clears prior successful canonical and artifact state", async () => {
  const studio = createStudioSession({ source: await load("abra-island.pt.hnk"), profile: "PT-BR" });
  assert.equal(studio.run().status, "ARTIFACT_GENERATED");
  studio.setSource(`mundo AbraIsland { entidade Alakazam { propriedade vida = 100 } }`);
  const invalid = studio.validate();
  assert.equal(invalid.status, "INVALID");
  assert.equal(invalid.goldenPath, null);
  assert.equal(invalid.artifact, null);
  assert.match(invalid.diagnostic, /HAKODAN_GOLDEN_PATH_EVENT_REQUIRED/);
});
