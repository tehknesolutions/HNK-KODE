# M36 Registry PR Review Checklist

- [ ] ingress guard accepts only M35 verified imports
- [ ] digest is deterministic identity
- [ ] exact replay is idempotent
- [ ] same-digest conflict is rejected
- [ ] preserved metadata is copied/frozen
- [ ] public API exposes no mutation/delete/execute/approve operation
- [ ] focused tests match Issue #128 contract
- [ ] executable status is not overstated
- [ ] Issue #125 round-trip ledger/history remains preserved
- [ ] numbering collision remains explicit
