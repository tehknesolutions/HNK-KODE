import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = new URL("../studio/", import.meta.url);

test("Studio shell exposes the creator loop and sandboxed preview", async () => {
  const html = await readFile(new URL("index.html", base), "utf8");
  for (const id of ["source", "profile", "validate", "run", "diagnostic", "inspector", "preview", "evidence"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /<iframe[^>]+id=["']preview["'][^>]+sandbox=["']["']/i);
});

test("Studio browser module delegates semantics to canonical haKodan modules", async () => {
  const js = await readFile(new URL("studio.mjs", base), "utf8");
  assert.match(js, /createStudioSession/);
  assert.match(js, /projectStudioInspector/);
  assert.doesNotMatch(js, /function\s+(parse|toHom|toHnkIr)\s*\(/);
  assert.match(js, /preview\.srcdoc\s*=\s*state\.artifact\.content/);
  assert.match(js, /textContent/);
});
