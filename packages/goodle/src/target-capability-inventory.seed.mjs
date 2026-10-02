import { buildTargetCapabilityInventory } from './target-capability-inventory.mjs';

// M8 inventory is conservative: only repository-visible adapter surfaces enter
// the inventory. A capability is promoted to CONFORMANT only when a dedicated
// contract test binds the declaration to the actual authority/adapter contract.
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
    id: 'goodle.target.hakodan-manifestation-plan.v1',
    target: 'hakodan-manifestation',
    format: 'manifestation-plan-v0.9',
    adapter: 'manifestation-bridge-v1',
    artifactPattern: '*.hakodan.manifest.json',
    authority: 'HAKODAN',
    source: 'packages/hakodan/src/manifestation-graph-v0.9.mjs',
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
