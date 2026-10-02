# M60 Test Matrix

| Slice | Scenario | Expected |
| --- | --- | --- |
| M60.1 | valid M59 snapshot | `SEALED` |
| M60.2 | reversed insertion order | identical digest/canonical entries |
| M60.2 | empty registry | deterministic zero-entry seal |
| M60.3 | valid seal verification | `valid=true` |
| M60.3 | digest tampering | `valid=false` |
| M60.4 | duplicate archive digest | `REJECTED` |
| M60.4 | broken sourceDigest binding | `REJECTED` |
| M60.4 | evidence promotion | `REJECTED` |
| M60.5 | returned seal/entries | frozen/immutable |
