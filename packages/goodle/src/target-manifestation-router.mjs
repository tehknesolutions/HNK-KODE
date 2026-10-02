import {
  buildRegistryFromInventory,
  resolveInventoryCapability,
} from './target-capability-inventory.mjs';
import { bridgeToHakodanManifestation } from './manifestation-bridge.mjs';

const ROUTES = Object.freeze({
  'manifestation-bridge-v1': bridgeToHakodanManifestation,
});

export function routeTargetManifestation(input = {}, actor = {}, inventory) {
  const registry = buildRegistryFromInventory(inventory);
  const resolution = resolveInventoryCapability(registry, input);

  if (resolution.status !== 'SUPPORTED') {
    return {
      status: 'UNSUPPORTED',
      capability: null,
      request: null,
      plan: null,
    };
  }

  const capability = resolution.capability;
  if (capability.maturity !== 'CONFORMANT') {
    return {
      status: 'UNSUPPORTED',
      capability,
      request: null,
      plan: null,
    };
  }

  const route = ROUTES[capability.adapter];
  if (!route) {
    return {
      status: 'UNSUPPORTED',
      capability,
      request: null,
      plan: null,
    };
  }

  const request = Object.freeze({
    semanticId: input.semanticId,
    target: input.target,
    format: input.format,
    adapter: input.adapter,
    artifact: input.artifact,
  });
  const bridged = route(request, actor);

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
