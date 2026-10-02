# M36 Registry Data Model

Registry key: verified bundle `digest`.

Stored immutable entry:
- `version`
- `kind`
- `protocol`
- `stages` (copied + frozen)
- `sourceDigest`
- `ledger`
- `createdAt`
- `digest`

The M35 verification wrapper itself is not stored as mutable registry state; acceptance requires it at ingress.
