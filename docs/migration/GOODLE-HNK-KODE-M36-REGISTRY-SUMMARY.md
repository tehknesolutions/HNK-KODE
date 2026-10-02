# M36 Registry Summary

The registry slice adds deterministic repository-side cataloging of M35 verified conformance bundles. It is keyed by the verified bundle digest, is idempotent for exact duplicates, rejects conflicting content for an existing digest, preserves provenance metadata, and exposes immutable entries/snapshots.

Static implementation and focused test coverage are present. Executable PASS is intentionally not claimed without fresh execution evidence.
