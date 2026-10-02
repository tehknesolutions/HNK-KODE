import { bindTargetAdapter } from './target-adapter-binding.mjs';

export function routeTargetManifestation(input = {}, actor = {}, inventory) {
  const binding = bindTargetAdapter(input, inventory);

  if (binding.status !== 'BOUND') {
    return {
      status: 'UNSUPPORTED',
      capability: binding.capability ?? null,
      request: null,
      plan: null,
    };
  }

  const capability = binding.capability;
  const request = Object.freeze({
    semanticId: input.semanticId,
    target: capability.target,
    format: capability.format,
    adapter: capability.adapter,
    artifact: input.artifact,
  });
  const bridged = binding.invoke(request, actor);

  if (bridged.plan?.semanticId && bridged.plan.semanticId !== request.semanticId) {
    throw new Error('GOODLE_TARGET_ROUTER_SEMANTIC_IDENTITY_DRIFT');
  }

  return {
    status: bridged.status === 'BRIDGED' ? 'ROUTED' : bridged.status,
    capability,
    request,
    plan: bridged.plan ?? null,
    intent: bridged.intent,
    missing: bridged.missing ?? [],
  };
}
