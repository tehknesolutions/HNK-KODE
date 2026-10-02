# M36 Registry Test Matrix

| Slice | Contract | Repository coverage |
| --- | --- | --- |
| M36.1 | Only M35 verified imports accepted | focused test |
| M36.2 | Deterministic digest registration + lookup | focused test |
| M36.3 | Exact duplicates are idempotent | focused test |
| M36.4 | Conflicting same-digest payload rejected; immutable storage/snapshot | focused tests |
| M36.5 | Public API + verification ledger | index export + dedicated ledger |

Executable classification remains `NOT_RUN` until fresh stdout/stderr and exit code are captured. Static presence is not promoted into an executable PASS claim.
