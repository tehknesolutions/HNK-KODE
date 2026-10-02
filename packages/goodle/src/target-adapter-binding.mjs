import {
  buildRegistryFromInventory,
  resolveInventoryCapability,
} from './target-capability-inventory.mjs';
import { bridgeToHakodanManifestation } from './manifestation-bridge.mjs';

const ADAPTERS = Object.freeze({
  'manifestation-bridge-v1': bridgeToHakodanManifestation,
});

export function bindTargetAdapter(input = {}, inventory) {
  const registry = buildRegistryFromInventory(inventory);
  const resolution = resolveInventoryCapability(registry, input);

  if (resolution.status !== 'SUPPORTED') {
    return { status: 'UNSUPPORTED', capability: null, invoke: null };
  }

  const capability = resolution.capability;
  if (
    capability.maturity !== 'CONFORMANT' ||
    capability.adapter !== input.adapter
  ) {
    return { status: 'UNSUPPORTED', capability: null, invoke: null };
  }

  const invoke = ADAPTERS[capability.adapter];
  if (!invoke) {
    return { status: 'UNSUPPORTED', capability, invoke: null };
  }

  return Object.freeze({
    status: 'BOUND',
    capability,
    invoke,
  });
}
