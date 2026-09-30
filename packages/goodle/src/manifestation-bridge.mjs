import { planManifestation as planGoodleManifestation } from './manifestation-intent.mjs';
import { planManifestation as planHakodanManifestation } from '../../hakodan/src/manifestation-graph-v0.9.mjs';

export function bridgeToHakodanManifestation(input = {}, actor = {}) {
  const goodle = planGoodleManifestation(input);

  if (goodle.status !== 'PLANNED') {
    return {
      status: goodle.status,
      missing: goodle.missing ?? [],
      intent: goodle.intent,
      plan: null,
    };
  }

  if (!goodle.plan.semanticId) {
    return {
      status: 'UNRESOLVED',
      missing: ['semanticId'],
      intent: goodle.intent,
      plan: null,
    };
  }

  const request = {
    semanticId: goodle.plan.semanticId,
    target: goodle.plan.target,
    format: goodle.plan.format,
    adapter: goodle.plan.adapter,
    artifact: goodle.plan.artifact,
  };

  const plan = planHakodanManifestation(request, actor);

  if (plan.semanticId !== input.semanticId) {
    throw new Error('GOODLE_HAKODAN_SEMANTIC_IDENTITY_DRIFT');
  }

  return {
    status: 'BRIDGED',
    missing: [],
    intent: goodle.intent,
    plan,
  };
}
