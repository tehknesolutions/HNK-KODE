import { createTargetRegistry, registerTargetCapability } from './target-capability-registry.mjs';

export const TARGET_CAPABILITY_INVENTORY = Object.freeze([
  Object.freeze({
    id: 'hnk-verse-reference-avatar-runtime',
    status: 'EXECUTABLE',
    source: Object.freeze({
      repository: 'tehknesolutions/HNK-VERSE',
      path: 'packages/renderer/src/reference-avatar-runtime.ts',
    }),
    capability: Object.freeze({
      target: 'hnk-verse-reference-avatar',
      format: 'runtime-frame',
      adapter: 'hnk-verse:reference-avatar',
      artifact: 'reference-avatar.frame',
      artifactPattern: '*.frame',
      authority: 'HAKODAN',
    }),
  }),
  Object.freeze({
    id: 'hnk-verse-web-shell',
    status: 'EXECUTABLE',
    source: Object.freeze({
      repository: 'tehknesolutions/HNK-VERSE',
      path: 'apps/web/src/main.ts',
    }),
    capability: Object.freeze({
      target: 'hnk-verse-web',
      format: 'html',
      adapter: 'hnk-verse:web-shell',
      artifact: 'index.html',
      artifactPattern: '*.html',
      authority: 'HAKODAN',
    }),
  }),
  Object.freeze({
    id: 'codex-hnk-web-app',
    status: 'DECLARED',
    source: Object.freeze({
      repository: 'tehknesolutions/codex-hnk',
      path: 'apps/web/package.json',
    }),
    capability: Object.freeze({
      target: 'codex-hnk-web',
      format: 'web-app',
      adapter: 'codex-hnk:next',
      artifact: 'app',
      artifactPattern: 'app',
      authority: 'HAKODAN',
    }),
  }),
  Object.freeze({
    id: 'codex-hnk-mobile-app',
    status: 'DECLARED',
    source: Object.freeze({
      repository: 'tehknesolutions/codex-hnk',
      path: 'apps/mobile/app.json',
    }),
    capability: Object.freeze({
      target: 'codex-hnk-mobile',
      format: 'mobile-app',
      adapter: 'codex-hnk:mobile',
      artifact: 'app',
      artifactPattern: 'app',
      authority: 'HAKODAN',
    }),
  }),
  Object.freeze({
    id: 'tehkne-os-target',
    status: 'UNRESOLVED',
    source: Object.freeze({
      repository: 'tehknesolutions/tehkne-os',
      path: 'README.md',
    }),
    capability: Object.freeze({
      target: 'tehkne-os',
      format: 'system',
      adapter: 'tehkne-os:unresolved',
      artifact: 'system',
      artifactPattern: 'system',
      authority: 'HAKODAN',
    }),
  }),
]);

export function executableInventoryEntries(inventory = TARGET_CAPABILITY_INVENTORY) {
  return inventory.filter((entry) => entry.status === 'EXECUTABLE');
}

export function buildRegistryFromInventory(inventory = TARGET_CAPABILITY_INVENTORY) {
  return executableInventoryEntries(inventory).reduce(
    (registry, entry) => registerTargetCapability(registry, entry.capability),
    createTargetRegistry(),
  );
}
