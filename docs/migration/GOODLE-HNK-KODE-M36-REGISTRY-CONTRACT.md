# M36 Verified Bundle Registry Contract

Input authority boundary: M35 `IMPORTED_VERIFIED` + `verification.valid === true`.

Deterministic identity: `bundle.digest`.

Preserved fields: `version`, `kind`, `protocol`, `stages`, `sourceDigest`, `ledger`, `createdAt`, `digest`.

State transitions:
- absent digest + valid verified input → `REGISTERED`;
- existing digest + identical preserved entry → `ALREADY_REGISTERED`;
- existing digest + different preserved entry → `REJECTED / DIGEST_CONFLICT`;
- invalid/unverified input → `REJECTED / M35_VERIFIED_IMPORT_REQUIRED`.

The registry is append-only through its public API; no delete or mutation operation is exposed.
