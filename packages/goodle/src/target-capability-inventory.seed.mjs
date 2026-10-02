import { buildTargetCapabilityInventory } from './target-capability-inventory.mjs';

// M8 inventory is conservative: only repository-visible adapter surfaces enter
// the inventory. A capability is promoted to CONFORMANT only when a dedicated
// contract test binds the declaration to the actual adapter authority envelope.
export const GOODLE_TARGET_CAPABILITY_INVENTORY_V1 = buildTargetCapabilityInventory([
  {
    id: 'goodle.target.hakodan-runtime.v1',
    target: 'hakodan-runtime',
    format: 'hakodan-runtime-request',
    adapter: 'runtime-adapter-v1',
    artifactPattern: '*.hakodan.json',
    authority: 'HAKODAN',
    source: 'packages/goodle/src/runtime-adapter.mjs',
    maturity: 'CONFORMANT',
  },
  {
    id: 'goodle.target.future-unresolved.v1',
    target: 'future-target',
    format: 'UNRESOLVED',
    adapter: 'UNRESOLVED',
    artifactPattern: '*.unresolved',
    authority: 'HNK-KODE',
    source: 'docs/migration/GOODLE-HNK-KODE-M8-TARGET-CAPABILITY-INVENTORY.md',
    maturity: 'UNRESOLVED',
  },
]);
