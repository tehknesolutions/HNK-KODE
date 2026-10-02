# M36 Registry Design Decisions

- Use the already verified bundle digest as identity rather than minting a second registry identifier.
- Copy/freeze preserved fields at registration time rather than retaining the caller's object reference.
- Treat exact re-registration as an idempotent success state (`ALREADY_REGISTERED`).
- Treat different preserved content under an existing digest as an integrity conflict.
- Expose no mutation or deletion API in this slice.
- Keep registry semantics strictly below execution/canon authority.
