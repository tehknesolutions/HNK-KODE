# M60 Invariants

1. Registry snapshot identity is M59-only.
2. Entry ordering is canonical by archive digest.
3. Archive digest uniqueness is mandatory.
4. Archive `sourceDigest` must equal its embedded seal digest.
5. Evidence class remains `PROTOCOL_CONFORMANCE`.
6. SHA-256 digest binds the complete M60 payload.
7. Seal integrity never implies execution authority.
