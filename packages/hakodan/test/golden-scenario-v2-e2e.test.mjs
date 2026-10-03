import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";
import { compileHtmlDocument } from "../src/target-html-document.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "../examples/abras-island-golden.hakodan");

function executeCanonicalStep(ir) {
  const state = new Map(ir.world.entities.map(entity => [entity.id, {
    id: entity.id,
    name: entity.name,
    ...entity.properties,
    position: { x: Number(entity.properties.x ?? 0), y: Number(entity.properties.y ?? 0) }
  }]));
  const alakazam = [...state.values()].find(entity => entity.name === "Alakazam");
  const portal = [...state.values()].find(entity => entity.name === "Portal");
  const before = portal.open;

  alakazam.position = { x: portal.position.x - 2, y: portal.position.y };

  for (const rule of ir.world.rules) {
    assert.equal(rule.trigger, "tick");
    assert.equal(rule.condition.kind, "NEAR");
    const subject = state.get(rule.condition.subject);
    const target = state.get(rule.condition.target);
    const near = Math.hypot(subject.position.x - target.position.x, subject.position.y - target.position.y) <= rule.condition.threshold;
    if (!near) continue;
    for (const action of rule.actions) {
      assert.equal(action.kind, "SET");
      state.get(action.subject)[action.path] = action.value;
    }
  }

  return { before, after: portal.open };
}

test("V2-6 proves Abra's Island source -> IR/HOM -> canonical transition -> HTML manifestation contract", async () => {
  const source = await readFile(sourcePath, "utf8");
  const ast = parse(source, { profile: "PT-BR" });
  const ir = toHnkIr(ast);
  const hom = toHom(ast);
  const html = compileHtmlDocument({ ir, hom });
  const transition = executeCanonicalStep(ir);

  assert.equal(ir.version, "0.2.0");
  assert.equal(hom.version, "0.2.0");
  assert.deepEqual(transition, { before: false, after: true });
  assert.match(html, /data-state-open="false"/);
  assert.match(html, /evaluateCondition/);
  assert.match(html, /applyAction/);
  assert.match(html, /renderEntity/);
  assert.match(html, /el\.dataset\.stateOpen=String\(entity\.open\)/);
  assert.doesNotMatch(html, /portal\.open\s*=\s*true/i);
});
