# M38 Recovery Gate

The recovery is repository-complete when `main` contains all four M38 surfaces:

1. `packages/goodle/src/evidence-provenance-conformance-attestation-import.mjs`
2. `packages/goodle/test/evidence-provenance-conformance-attestation-import.test.mjs`
3. public export in `packages/goodle/src/index.mjs`
4. `docs/migration/GOODLE-HNK-KODE-M38-VERIFICATION-LEDGER.md`

This gate is intentionally independent of local execution and GitHub Actions. Executable verification remains a separate evidence class and is not inferred from repository completeness.
