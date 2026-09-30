import test from "node:test";
import assert from "node:assert/strict";
import { SEMANTIC_TOKENS } from "../../hakodan/src/semantic-tokens.mjs";
import { classifyGoodleSemantic } from "../src/semantic-data-adapter.mjs";

const exactSurfaceCases = [
  ["mundo", "WORLD"],
  ["world", "WORLD"],
  ["entidade", "ENTITY"],
  ["entity", "ENTITY"],
  ["propriedade", "PROPERTY"],
  ["property", "PROPERTY"],
  ["evento", "EVENT"],
  ["event", "EVENT"],
  ["ação", "ACTION"],
  ["action", "ACTION"],
  ["quando", "WHEN"],
  ["when", "WHEN"]
];

test("Goodle exact mappings agree with the executable haKodan token table", () => {
  for (const [surface, expectedId] of exactSurfaceCases) {
    assert.ok(SEMANTIC_TOKENS[expectedId], `missing executable token ${expectedId}`);
    assert.equal(classifyGoodleSemantic(surface).semanticId, expectedId);
  }
});

test("spec-only bootstrap IDs are not treated as executable haKodan tokens yet", () => {
  for (const surface of ["se", "senão", "emitir", "observar", "cenário", "intenção", "manifestar"]) {
    const classification = classifyGoodleSemantic(surface);
    assert.equal(classification.status, "UNRESOLVED");
    assert.equal(classification.executable, false);
  }
});
