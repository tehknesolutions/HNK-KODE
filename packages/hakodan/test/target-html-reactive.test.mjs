import test from "node:test";
import assert from "node:assert/strict";
import { parse, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";
import { compileHtmlDocument } from "../src/target-html-document.mjs";

const source = `mundo AbrasIsland {
  entidade Alakazam { propriedade x = 0; propriedade y = 0; }
  entidade Portal { propriedade x = 10; propriedade y = 0; propriedade open = false; }
  quando perto(Alakazam, Portal, 2) { ação definir(Portal, open, true); }
}`;

test("V2-4 HTML target accepts reactive IR/HOM 0.2.0", () => {
  const ast = parse(source, { profile: "PT-BR" });
  const html = compileHtmlDocument({ ir: toHnkIr(ast), hom: toHom(ast) });
  assert.match(html, /data-hakodan-target="hakodan\.target\.html-document\.v2"/);
});

test("V2-4 artifact carries canonical rules and state for manifestation", () => {
  const ast = parse(source, { profile: "PT-BR" });
  const html = compileHtmlDocument({ ir: toHnkIr(ast), hom: toHom(ast) });
  assert.match(html, /NEAR/);
  assert.match(html, /SET/);
  assert.match(html, /data-entity="Alakazam"/);
  assert.match(html, /data-entity="Portal"/);
  assert.match(html, /data-state-open="false"/);
});

test("V2-4 target exposes movement control but derives portal opening from canonical rule", () => {
  const ast = parse(source, { profile: "PT-BR" });
  const html = compileHtmlDocument({ ir: toHnkIr(ast), hom: toHom(ast) });
  assert.match(html, /data-control="approach"/);
  assert.match(html, /evaluateCondition/);
  assert.match(html, /applyAction/);
  assert.doesNotMatch(html, /entity\.open\s*=\s*true/);
  assert.doesNotMatch(html, /stateOpen\s*=\s*["']true["']/);
});
