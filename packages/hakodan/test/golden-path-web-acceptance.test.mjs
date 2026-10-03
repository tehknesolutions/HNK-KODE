import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { manifest } from "../src/manifest-v1.mjs";

const base = new URL("../examples/golden-path-web/", import.meta.url);

test("AbraIsland PT-BR/EN fixtures converge to one web manifestation", async () => {
  const pt = await readFile(new URL("abra-island.pt.hnk", base), "utf8");
  const en = await readFile(new URL("abra-island.en.hnk", base), "utf8");
  const a = manifest(pt, { profile: "PT-BR", target: "web" });
  const b = manifest(en, { profile: "EN", target: "web" });

  assert.equal(a.status, "ARTIFACT_GENERATED");
  assert.equal(a.artifact.executionEvidence, "UNVERIFIED");
  assert.equal(a.artifact.content, b.artifact.content);
  assert.match(a.artifact.content, /AbraIsland/);
  assert.match(a.artifact.content, /Alakazam/);
  assert.match(a.artifact.content, /"vida":100/);
});