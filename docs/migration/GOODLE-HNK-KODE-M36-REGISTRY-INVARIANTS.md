# M36 Registry Invariants

- Ingress must be M35 verified.
- Digest is identity.
- One digest maps to one preserved entry.
- Exact replay is idempotent.
- Same digest plus different preserved content is a conflict.
- Caller mutation cannot rewrite stored stage metadata.
- Public registry surface exposes no delete/mutate operation.
- Registry membership never upgrades execution, governance, or canon authority.
