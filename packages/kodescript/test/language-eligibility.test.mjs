import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateLanguageEligibility, evaluateBenchmarkEligibility } from '../src/language-eligibility.mjs';

const acquisitionUrl = new URL('../../../data/acquisition/hnk40-e5-acquisition.v1.json', import.meta.url);
const acquisition = JSON.parse(await readFile(acquisitionUrl,'utf8'));

test('HNK40 eligibility preserves 38 resolved + 2 ambiguous', () => {
  const out = evaluateBenchmarkEligibility(acquisition);
  assert.equal(out.summary.total,40);
  assert.equal(out.summary.structuralExperimentReady,38);
  assert.equal(out.summary.ambiguousExperimentSet,2);
  assert.equal(out.summary.blockedStructural,0);
  assert.equal(out.summary.canonicalBindings,0);
  assert.equal(out.automaticSemanticAssignments,0);
});

test('G17 and G20 remain experiment sets and cannot bind canonically', () => {
  const out = evaluateBenchmarkEligibility(acquisition);
  for (const glyphId of ['G17','G20']) {
    const r = out.records.find(x => x.identityId === glyphId);
    assert.equal(r.structuralEligibility,'AMBIGUOUS_EXPERIMENT_SET');
    assert.equal(r.candidateProjectionIds.length,2);
    assert.equal(r.canonicalBindingAllowed,false);
  }
});

test('resolved geometry without linguistic binding is not canon', () => {
  const r = evaluateLanguageEligibility(acquisition.records[0]);
  assert.equal(r.structuralEligibility,'STRUCTURAL_EXPERIMENT_READY');
  assert.equal(r.bindingReadiness,'NO_BINDING');
  assert.equal(r.namespace,'EXPERIMENTAL');
  assert.equal(r.canonicalBindingAllowed,false);
});

test('canon binding requires resolved identity, provenance, payload, and promotable namespace', () => {
  const record = acquisition.records[0];
  const binding = {
    authority:'HNK_CANON',
    namespace:'LANGUAGE',
    provenance:{source:'PROJECT_CANON_DECISION',decision:'EXPLICIT',version:'1'},
    linguisticBinding:{lexeme:'AHNUVA',phonologyRef:null,semanticRef:'HK-LEX-AHNUVA',grammarRef:null,astRef:null,irRef:null}
  };
  const ok = evaluateLanguageEligibility(record,{binding});
  assert.equal(ok.bindingReadiness,'CANON_BINDING');
  assert.equal(ok.canonicalBindingAllowed,true);

  const bad = evaluateLanguageEligibility(record,{binding:{...binding,provenance:null}});
  assert.equal(bad.canonicalBindingAllowed,false);
  assert.ok(bad.reasons.includes('canon_binding_missing_provenance'));
});
