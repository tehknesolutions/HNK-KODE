# M60 Consistency Guarantees

Equivalent valid M59 snapshots differing only in insertion order yield the same M60 canonical entries and digest.

Logically different canonical payloads are expected to produce different SHA-256 digests; collision resistance is delegated to SHA-256.
