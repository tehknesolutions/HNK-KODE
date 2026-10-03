import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse, toHnkIr } from "../src/parser.mjs";
import { createWorldRuntime } from "../src/world-runtime.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "../examples/abras-island-golden.hakodan");

async function runtime() {
  const source = await readFile(sourcePath, "utf8");
  const ir = toHnkIr(parse(source, { profile: "PT-BR" }));
  return { ir, runtime: createWorldRuntime(ir) };
}

test("V2-7 runtime keeps rules inert while NEAR is false", async () => {
  const { ir, runtime } = await runtime();
  const portal = ir.world.entities.find(entity => entity.name === "Portal");
  assert.equal(runtime.entity(portal.id).open, false);
  assert.deepEqual(runtime.tick(), []);
  assert.equal(runtime.entity(portal.id).open, false);
});

test("V2-7 runtime derives SET from NEAR and records deterministic change evidence", async () => {
  const { ir, runtime } = await runtime();
  const alakazam = ir.world.entities.find(entity => entity.name === "Alakazam");
  const portal = ir.world.entities.find(entity => entity.name === "Portal");

  runtime.setPosition(alakazam.id, 8, 0);
  const changes = runtime.tick();

  assert.equal(runtime.entity(portal.id).open, true);
  assert.equal(changes.length, 1);
  assert.deepEqual(changes[0], {
    ruleId: ir.world.rules[0].id,
    action: "SET",
    subject: portal.id,
    path: "open",
    before: false,
    after: true
  });
  assert.deepEqual(runtime.tick(), []);
});

test("V2-7 runtime snapshot is detached from mutable runtime state", async () => {
  const { ir, runtime } = await runtime();
  const alakazam = ir.world.entities.find(entity => entity.name === "Alakazam");
  const before = runtime.snapshot();
  runtime.setPosition(alakazam.id, 8, 0);
  assert.deepEqual(before[alakazam.id].position, { x: 0, y: 0 });
  assert.deepEqual(runtime.snapshot()[alakazam.id].position, { x: 8, y: 0 });
});
