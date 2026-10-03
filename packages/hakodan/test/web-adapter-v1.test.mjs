import test from "node:test";
import assert from "node:assert/strict";
import { buildGoldenPath } from "../src/golden-path-v1.mjs";
import { buildWebArtifact } from "../src/targets/web-adapter-v1.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;
const en = `world AbraIsland {
  entity Alakazam { property vida = 100 }
  event Despertar { action despertar("Alakazam") }
}`;

test("builds a visible deterministic web artifact", () => {
  const artifact = buildWebArtifact(buildGoldenPath(pt, { profile: "PT-BR" }));
  assert.equal(artifact.target, "web");
  assert.equal(artifact.mediaType, "text/html");
  assert.equal(artifact.executionEvidence, "UNVERIFIED");
  assert.match(artifact.content, /<!doctype html>/i);
  assert.match(artifact.content, /AbraIsland/);
  assert.match(artifact.content, /Alakazam/);
  assert.match(artifact.content, /vida/);
  assert.match(artifact.content, /Despertar/);
  assert.match(artifact.content, /despertar/);
});
test("PT-BR and EN produce byte-identical web artifacts", () => {
  const a = buildWebArtifact(buildGoldenPath(pt, { profile: "PT-BR" }));
  const b = buildWebArtifact(buildGoldenPath(en, { profile: "EN" }));
  assert.equal(a.content, b.content);
});