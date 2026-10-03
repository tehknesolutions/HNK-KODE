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

async function compileGolden() {
  const source = await readFile(sourcePath, "utf8");
  const ast = parse(source, { profile: "PT-BR" });
  const ir = toHnkIr(ast);
  const hom = toHom(ast);
  return { ast, ir, hom, html: compileHtmlDocument({ ir, hom }) };
}

test("V2-5 golden source traverses parser -> HNK-IR -> HOM -> HTML v2", async () => {
  const { ir, hom, html } = await compileGolden();
  assert.equal(ir.ir, "HNK-IR");
  assert.equal(ir.version, "0.2.0");
  assert.equal(hom.model, "HOM");
  assert.equal(hom.version, "0.2.0");
  assert.match(html, /hakodan\.target\.html-document\.v2/);
});

test("V2-5 golden artifact preserves closed Portal plus canonical NEAR -> SET transition", async () => {
  const { ir, html } = await compileGolden();
  assert.equal(ir.world.rules.length, 1);
  assert.equal(ir.world.rules[0].condition.kind, "NEAR");
  assert.equal(ir.world.rules[0].actions[0].kind, "SET");
  assert.match(html, /data-entity="Alakazam"/);
  assert.match(html, /data-entity="Portal"/);
  assert.match(html, /data-state-open="false"/);
  assert.match(html, /data-control="approach"/);
  assert.match(html, /Math\.hypot/);
  assert.doesNotMatch(html, /entity\.open\s*=\s*true/);
});
