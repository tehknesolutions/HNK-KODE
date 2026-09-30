import test from "node:test";
import assert from "node:assert/strict";
import { classifyGoodleSemantic } from "../src/semantic-data-adapter.mjs";

test("M3 never promotes unknown Goodle verbs by analogy", () => {
  for (const term of ["tocar", "diminuir", "aumentar", "mover", "salvar", "carregar"]) {
    const result = classifyGoodleSemantic(term);
    assert.equal(result.status, "UNMAPPED");
    assert.equal(result.semanticId, null);
    assert.equal(result.executable, false);
  }
});

test("M3 preserves the executable/spec distinction", () => {
  assert.equal(classifyGoodleSemantic("quando").status, "MAPPED");
  assert.equal(classifyGoodleSemantic("se").status, "UNRESOLVED");
  assert.equal(classifyGoodleSemantic("manifestar").status, "UNRESOLVED");
});
