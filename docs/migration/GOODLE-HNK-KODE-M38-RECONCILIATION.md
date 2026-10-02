# M38 — Main Lineage Reconciliation

Date: 2026-10-02

## Problem
PR #131 reports merged, but it targeted `feat/m37-conformance-attestation` rather than `main`. Therefore its M38 commits were not present on the repository default branch after the M37 merge.

## Reconciliation
This branch reapplies the M38 repository-visible contract onto the current `main` lineage:
- attestation import implementation;
- focused M38 contract tests;
- public `index.mjs` export.

The original M38 verification ledger remains available on the historical M38 branch; this reconciliation document records why the main-lineage repair exists.

## Evidence classification
Repository/static reconciliation only. No executable Node PASS is claimed.

## Invariant
`PROTOCOL_CONFORMANCE` remains distinct from `EXECUTION_EVIDENCE`.
