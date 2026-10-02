import { buildTargetCapabilityInventory } from './target-capability-inventory.mjs';

// M8 starts conservatively. These entries describe repository-visible adapter
// surfaces; maturity remains DECLARED until target-specific conformance evidence
// promotes an entry.
export const GOODLE_TARGET_CAPABILITY_INVENTORY_V1 = buildTargetCapabilityInventory([
  {
    id: 'goodle.target.hakodan-runtime.v1',
    target: 'hakodan-runtime',
    format: 'hakodan-runtime-request',
    adapter: 'runtime-adapter-v1',
    artifactPattern: '*.hakodan.json',
    authority: 'haKodan',
    source: 'packages/goodle/src/runtime-adapter.mjs',
    maturity: 'DECLARED',
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
