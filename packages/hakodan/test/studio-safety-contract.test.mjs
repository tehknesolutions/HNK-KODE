import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createStudioSession } from "../src/studio-session-v1.mjs";

const studioBase = new URL("../studio/", import.meta.url);
const valid = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;

test("source/profile mutation invalidates prior validation and manifestation", () => {
  const session = createStudioSession({ source: valid, profile: "PT-BR" });
  assert.equal(session.run().status, "ARTIFACT_GENERATED");
  session.setSource(valid.replace("100", "101"));
  assert.equal(session.state.status, "IDLE");
  assert.equal(session.state.goldenPath, null);
  assert.equal(session.state.artifact, null);
  session.setProfile("EN");
  assert.equal(session.state.status, "IDLE");
  assert.equal(session.state.goldenPath, null);
  assert.equal(session.state.artifact, null);
});

test("browser shell keeps generated content inside sandboxed srcdoc boundary", async () => {
  const html = await readFile(new URL("index.html", studioBase), "utf8");
  const js = await readFile(new URL("studio.mjs", studioBase), "utf8");
  assert.match(html, /<iframe[^>]*id=["']preview["'][^>]*sandbox=["']["']/i);
  assert.match(js, /preview\.srcdoc\s*=\s*state\.artifact\.content/);
  assert.doesNotMatch(js, /innerHTML\s*=/);
  assert.match(js, /diagnostic\.textContent/);
});

test("Studio does not manufacture EXECUTED evidence", async () => {
  const js = await readFile(new URL("studio.mjs", studioBase), "utf8");
  assert.doesNotMatch(js, /executionEvidence\s*=\s*["']EXECUTED["']/);
  const session = createStudioSession({ source: valid, profile: "PT-BR" });
  assert.equal(session.run().artifact.executionEvidence, "UNVERIFIED");
});
