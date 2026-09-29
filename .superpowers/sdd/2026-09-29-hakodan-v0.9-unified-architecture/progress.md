# SDD ledger — plan: docs/superpowers/plans/2026-09-29-hakodan-v0.9-unified-architecture.md
Baseline: feat/hakodan-v09-narrative at 41ecc27; 92/92 tests PASS.
Pre-flight: Tasks 2-9 consume semantic sentence/flow/state/APM/RLG/UMG/ULTM/GBCT interfaces from earlier tasks; interfaces align with spec.
Task 1: Ruling: HNK source support remains registry-driven and source-locked where canonical lexemes are absent; v0.9 must not invent HNK Kodins. Mixed PT-BR/EN aliases can be implemented now through Semantic IDs.
Task 1: complete (commits 41ecc27..988601b, tests: node --test packages/hakodan/test/*.test.mjs → 96 pass, 0 fail).
Task 2: complete (commit a1b018a, focused 4/4 PASS; full suite 100/100 PASS, 0 fail). Flow primitives and typed semantic scope validation added; no canonical HNK lexemes invented.
Task 3: complete (commit 03231eb, focused 3/3 PASS; full suite 103/103 PASS, 0 fail). Progressive and lateral discovery transitions are explicit; direct DISCOVERY→CANONIZE is rejected deterministically.
Task 4: complete (commit 62e19b5, focused 4/4 PASS; full suite 107/107 PASS, 0 fail). Authorship is distinct from authority; privileged discovery transitions pass through capability checks and append provenance snapshots.
Task 5: complete (commit 1814877, focused 4/4 PASS; full suite 111/111 PASS, 0 fail). Explicit causal dependencies, impact planning, cause tracing, cycle diagnostics and policy-gated effects are operational.
Task 6: complete (commit 4b47f46, focused 4/4 PASS; full suite 115/115 PASS, 0 fail). TARGET/FORMAT/ADAPTER/ARTIFACT are distinct; one Semantic ID can project multiple plans; MANIFEST is authority-gated and planning does not execute adapters.
Task 7: complete (commit 7466716, focused 5/5 PASS; full suite 120/120 PASS, 0 fail). ULTM L7..L0 contracts distinguish lowering from lifting, preserve semantic identity/provenance, and prohibit reconstructed SOURCE claims without source evidence.
Task 8: complete (commit 0afc57d, focused 5/5 PASS; full suite 125/125 PASS, 0 fail). Text/block/glyph metadata converge through Semantic ID; geometry cannot invent semantics; HNK-MATH remains descriptive/non-executable; unregistered HNK lexemes remain source-locked.
Task 9: complete (commit b0fc5bb, focused 5/5 PASS; full suite 130/130 PASS, 0 fail). Vertical slice proves PT-BR/EN/mixed convergence, identified FLOW semantics, authority-gated CANON/MANIFEST, manifestation planning and text↔block Semantic-ID preservation through an integrated v0.9 facade.
Task 10: complete. Audit documentation, project snapshot and changelog updated. Final local suite verified at 130/130 PASS, 0 fail. v0.9 backend/glyph-canon non-goals explicitly recorded. Remote CI green is not claimed because the known GitHub Actions billing restriction remains unresolved.
