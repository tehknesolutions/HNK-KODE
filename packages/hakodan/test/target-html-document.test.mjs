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

function compile() {
  const ast = parse(source, { profile: "PT-BR" });
  const ir = toHnkIr(ast);
  const hom = toHom(ast);
  return { ast, ir, hom, html: compileHtmlDocument({ ir, hom }) };
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

test("HMV-4 maps mostrar action to visible DOM output", () => {
  const { html } = compile();
  assert.match(html, /action\.name==="mostrar"/);
  assert.match(html, /output\.appendChild\(p\)/);
});

test("HMV-4 output is byte deterministic", () => {
  assert.equal(compile().html, compile().html);
});

test("HMV-4 rejects unsupported actions explicitly", () => {
  const ast = parse(`mundo X { evento iniciar { ação desconhecida("x"); } }`, { profile: "PT-BR" });
  assert.throws(() => compileHtmlDocument({ ir: toHnkIr(ast), hom: toHom(ast) }), /HAKODAN_HTML_TARGET_UNSUPPORTED_ACTION/);
});

test("HMV-4 rejects malformed canonical input", () => {
  assert.throws(() => compileHtmlDocument({ ir: {}, hom: {} }), /HAKODAN_HTML_TARGET_INVALID_IR/);
});
