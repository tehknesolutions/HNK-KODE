# M36 Registry Integrity Properties

The registry is deliberately narrow:

1. An unverified object is rejected before storage.
2. The verified bundle digest is the registration key.
3. Repeating the same verified entry does not duplicate state.
4. Different preserved metadata under an already registered digest is a conflict and is rejected.
5. Stored stage metadata is copied and frozen, preventing later mutation of the caller object from changing the registry record.
6. Registry membership carries no execution, governance, or canon authority.

This is a repository/audit integrity boundary, not a runtime authorization mechanism.
