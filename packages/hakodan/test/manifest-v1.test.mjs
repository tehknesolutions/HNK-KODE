import test from "node:test";
import assert from "node:assert/strict";
import { manifest } from "../src/manifest-v1.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;
const en = `world AbraIsland {
  entity Alakazam { property vida = 100 }
  event Despertar { action despertar("Alakazam") }
}`;

test("manifests PT-BR source to a web artifact without claiming execution", () => {
  const result = manifest(pt, { profile: "PT-BR", target: "web" });
  assert.equal(result.target, "web");
  assert.equal(result.status, "ARTIFACT_GENERATED");
  assert.equal(result.artifact.executionEvidence, "UNVERIFIED");
  assert.equal(result.goldenPath.ir.world.name, "AbraIsland");
});

test("PT-BR and EN manifestation converge to identical artifact", () => {
  const a = manifest(pt, { profile: "PT-BR", target: "web" });
  const b = manifest(en, { profile: "EN", target: "web" });
  assert.equal(a.artifact.content, b.artifact.content);
});
test("unsupported target fails closed", () => {
  assert.throws(
    () => manifest(pt, { profile: "PT-BR", target: "native" }),
    /HAKODAN_TARGET_UNSUPPORTED/
  );
});

test("incomplete Golden Path fails before artifact generation", () => {
  assert.throws(
    () => manifest(`mundo AbraIsland { entidade Alakazam { propriedade vida = 100 } }`, {
      profile: "PT-BR", target: "web"
    }),
    /HAKODAN_GOLDEN_PATH_EVENT_REQUIRED/
  );
});