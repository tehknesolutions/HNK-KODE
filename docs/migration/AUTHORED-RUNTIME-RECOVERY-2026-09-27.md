# Authored runtime recovery — provenance lock

Date: 2026-09-27

The missing runtime is not hypothetical and must not be reconstructed from declarations.

Exact historical source:

- commit: `69bb8309742fb3e2a45f2ae9bf98ec2fac1f7d55`
- commit message: `fix: restore source-locked authored registry runtime`
- path: `packages/hnk-linguas/src/authored.mjs`
- historical blob SHA: `f685640728d2e5bb7960edd824ec5ccd2ebc2133`
- size/history: 167 lines added in that commit
- registry version inside source: `1.10.0-candidate`
- registry status: `GOVERNED_AUTHORING_CANDIDATES`
- registry source: `SIMPLEWAY_HNK_AUTHORING_2026-09-10`

The immediately following commit `a1d963c1c590d59df35dad8b2a640940bcf31cd5` deleted the authored runtime while restoring `grammar-core-v1.mjs`, leaving that grammar runtime importing a file no longer present.

Recovery rule: restore the exact historical blob; do not regenerate authored linguistic entries from memory, declarations or inference.
