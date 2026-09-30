import test from "node:test";
import assert from "node:assert/strict";
import { parseSurface, semanticToSurface, surfaceToBlock, blockToSurface } from "../src/triple-surface-v1.mjs";

test("PT-BR and EN surface forms converge to one semantic model", () => {
  const pt = parseSurface("CRIAR Garukan CLASSE Teknomage", "PT-BR");
  const en = parseSurface("CREATE Garukan CLASS Teknomage", "EN");
  assert.deepEqual(pt.semantic, en.semantic);
});
test("accented and ASCII PT-BR forms remain equivalent", () => {
  const a = parseSurface("CRIAÇÃO Garukan CLASSE Teknomage", "PT-BR");
  const b = parseSurface("CRIACAO Garukan CLASSE Teknomage", "PT-BR");
  assert.deepEqual(a.semantic, b.semantic);
});
test("token-level PT-BR/EN mixing is deterministic", () => {
  const mixed = parseSurface("CREATE Garukan CLASSE Teknomage", "MIXED");
  const en = parseSurface("CREATE Garukan CLASS Teknomage", "EN");
  assert.deepEqual(mixed.semantic, en.semantic);
});
test("semantic model can project back to PT-BR and EN", () => {
  const semantic = parseSurface("CREATE Garukan CLASS Teknomage", "EN").semantic;
  assert.equal(semanticToSurface(semantic, "PT-BR"), "CRIAR Garukan CLASSE Teknomage");
  assert.equal(semanticToSurface(semantic, "EN"), "CREATE Garukan CLASS Teknomage");
});
test("surface semantic model projects to the same visual block contract", () => {
  const block = surfaceToBlock("CRIAR Garukan CLASSE Teknomage", "PT-BR");
  const get=id=>block.inputs.find(x=>x.id===id)?.value;
  assert.equal(block.semanticId, "ACTION.CREATE");
  assert.equal(get("entity"), "Garukan");
  assert.equal(get("class"), "Teknomage");
});
test("block projects deterministically to both textual surfaces", () => {
  const block = surfaceToBlock("CREATE Garukan CLASS Teknomage", "EN");
  assert.equal(blockToSurface(block, "PT-BR"), "CRIAR Garukan CLASSE Teknomage");
  assert.equal(blockToSurface(block, "EN"), "CREATE Garukan CLASS Teknomage");
});
test("HNK surface stays fail-closed until an explicit lexical registry is supplied", () => {
  assert.throws(() => parseSurface("CREATE Garukan CLASS Teknomage", "HNK"), /HAKODAN_HNK_SURFACE_LOCKED/);
});
