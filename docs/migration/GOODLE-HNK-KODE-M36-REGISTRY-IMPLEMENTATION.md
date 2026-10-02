# M36 Registry Implementation

The implementation lives in `packages/goodle/src/evidence-provenance-verified-bundle-registry.mjs` with focused coverage in `packages/goodle/test/evidence-provenance-verified-bundle-registry.test.mjs`.

Public surface: `createVerifiedBundleRegistry()`.

Operations:
- `register(importResult)` — accepts only an M35 `IMPORTED_VERIFIED` result whose verification is valid;
- `get(digest)` — reads a registered immutable entry;
- `snapshot()` — returns a frozen registry snapshot;
- `size()` — reports unique registered digests.

Registration outcomes: `REGISTERED`, `ALREADY_REGISTERED`, or `REJECTED` with `M35_VERIFIED_IMPORT_REQUIRED` / `DIGEST_CONFLICT`.
