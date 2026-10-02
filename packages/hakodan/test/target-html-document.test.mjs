import test from "node:test";
import assert from "node:assert/strict";
import { parse, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";
import { compileHtmlDocument, HAKODAN_HTML_DOCUMENT_TARGET_ID } from "../src/target-html-document.mjs";

const source = `mundo PrimeiraManifestacao {
  entidade Mensagem {
    propriedade texto = "haKodan manifestou.";
  }
  evento iniciar {
    ação mostrar("haKodan manifestou.");
  }
}`;

function compile(input = source, options = {}) {
  const ast = parse(input, { profile: "PT-BR" });
  const ir = toHnkIr(ast);
  const hom = toHom(ast);
  return { ast, ir, hom, html: compileHtmlDocument({ ir, hom, ...options }) };
}

test("HMV-4 crosses source -> AST -> HNK-IR -> HOM -> HTML", () => {
  const result = compile();
  assert.equal(result.ast.kind, "Program");
  assert.equal(result.ir.ir, "HNK-IR");
  assert.equal(result.hom.model, "HOM");
  assert.match(result.html, /^<!doctype html>/);
  assert.match(result.html, new RegExp(HAKODAN_HTML_DOCUMENT_TARGET_ID.replaceAll(".", "\\.")));
});

test("HMV-4 manifests entity and property data", () => {
  const { html } = compile();
  assert.match(html, /Mensagem/);
  assert.match(html, /texto/);
  assert.match(html, /haKodan manifestou\./);
});

test("HMV-4 maps mostrar action to explicit event dispatch", () => {
  const { html } = compile();
  assert.match(html, /function dispatch\(eventName\)/);
  assert.match(html, /action\.name==="mostrar"/);
  assert.match(html, /dispatch\("iniciar"\)/);
});

test("HMV-4 preserves event boundaries instead of flattening all actions", () => {
  const input = `mundo X { evento iniciar { ação mostrar("A"); } evento depois { ação mostrar("B"); } }`;
  const { html } = compile(input);
  assert.match(html, /const events=\{"iniciar":\[.*"A".*\],"depois":\[.*"B".*\]\}/);
  assert.match(html, /dispatch\("iniciar"\)/);
  assert.doesNotMatch(html, /const actions=/);
});

test("HMV-4 output is byte deterministic", () => {
  assert.equal(compile().html, compile().html);
});

test("HMV-4 rejects unsupported actions explicitly", () => {
  assert.throws(() => compile(`mundo X { evento iniciar { ação desconhecida("x"); } }`), /HAKODAN_HTML_TARGET_UNSUPPORTED_ACTION/);
});

test("HMV-4 rejects mostrar with zero or multiple arguments", () => {
  assert.throws(() => compile(`mundo X { evento iniciar { ação mostrar(); } }`), /HAKODAN_HTML_TARGET_UNSUPPORTED_ACTION/);
  assert.throws(() => compile(`mundo X { evento iniciar { ação mostrar("a", "b"); } }`), /HAKODAN_HTML_TARGET_UNSUPPORTED_ACTION/);
});

test("HMV-4 rejects malformed canonical input", () => {
  assert.throws(() => compileHtmlDocument({ ir: {}, hom: {} }), /HAKODAN_HTML_TARGET_INVALID_IR/);
});
