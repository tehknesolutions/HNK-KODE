import test from "node:test";
import assert from "node:assert/strict";
import { parseNarrativeSentence, normalizeSemanticSentence } from "../src/narrative-sentence-v0.9.mjs";

test("compact and explicit CREATE converge semantically", () => {
  const compact = parseNarrativeSentence("CREATE Garukan CLASS Teknomage");
  const explicit = parseNarrativeSentence("CREATE Garukan { CLASS: Teknomage }");
  assert.deepEqual(normalizeSemanticSentence(compact), normalizeSemanticSentence(explicit));
});

test("PT-BR, EN and mixed aliases converge to Semantic IDs", () => {
  const pt = parseNarrativeSentence("CRIAR Garukan CLASSE Teknomage");
  const en = parseNarrativeSentence("CREATE Garukan CLASS Teknomage");
  const mixed = parseNarrativeSentence("CREATE Garukan CLASSE Teknomage");
  assert.deepEqual(normalizeSemanticSentence(pt), normalizeSemanticSentence(en));
  assert.deepEqual(normalizeSemanticSentence(mixed), normalizeSemanticSentence(en));
});

test("PT-BR accepts accent-normalized aliases", () => {
  const accented = parseNarrativeSentence("CRIAÇÃO Garukan CLASSE Teknomage");
  const normalized = parseNarrativeSentence("CRIACAO Garukan CLASSE Teknomage");
  assert.deepEqual(normalizeSemanticSentence(accented), normalizeSemanticSentence(normalized));
});

test("omitted context uses an explicit deterministic default", () => {
  const node = parseNarrativeSentence("CREATE Garukan");
  assert.equal(node.context.semanticId, "CONTEXT.CURRENT");
  assert.equal(node.agent.semanticId, "AGENT.SYSTEM");
});
