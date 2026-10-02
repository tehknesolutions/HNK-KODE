# M60 Implementation Surface

Creation validates M59 identity, canonicalizes entries, validates nested archive lineage, rejects duplicate digests, hashes the canonical payload and returns a frozen seal.

Verification validates the M60 identity, validates canonical entries, independently recomputes the digest and reports integrity validity.
