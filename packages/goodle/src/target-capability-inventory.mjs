import {
  createTargetRegistry,
  registerTargetCapability,
  resolveTargetCapability,
} from './target-capability-registry.mjs';

const MATURITY = new Set(['DECLARED', 'CONFORMANT', 'UNRESOLVED']);
const REQUIRED = [
  'id',
  'target',
  'format',
  'adapter',
  'artifactPattern',
  'authority',
  'source',
  'maturity',
];

function validateEntry(entry) {
  for (const field of REQUIRED) {
    if (!entry?.[field]) throw new Error(`GOODLE_TARGET_INVENTORY_MISSING:${field}`);
  }
  if (!MATURITY.has(entry.maturity)) {
    throw new Error(`GOODLE_TARGET_INVENTORY_MATURITY:${entry.maturity}`);
  }
}

export function buildTargetCapabilityInventory(entries = []) {
  const byId = new Map();
  for (const entry of entries) {
    validateEntry(entry);
    const frozen = Object.freeze(structuredClone(entry));
    const existing = byId.get(entry.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(frozen)) {
      throw new Error(`GOODLE_TARGET_INVENTORY_CONFLICT:${entry.id}`);
    }
    byId.set(entry.id, frozen);
  }
  return Object.freeze({
    kind: 'TargetCapabilityInventory',
    entries: Object.freeze([...byId.values()]),
  });
}

export function buildRegistryFromInventory(inventory) {
  let registry = createTargetRegistry();
  for (const entry of inventory?.entries ?? []) {
    if (entry.maturity === 'UNRESOLVED') continue;
    registry = registerTargetCapability(registry, {
      target: entry.target,
      format: entry.format,
      adapter: entry.adapter,
      artifactPattern: entry.artifactPattern,
      authority: entry.authority,
      source: entry.source,
      maturity: entry.maturity,
      inventoryId: entry.id,
    });
  }
  return registry;
}

export function resolveInventoryCapability(registry, request) {
  return resolveTargetCapability(registry, request);
}
