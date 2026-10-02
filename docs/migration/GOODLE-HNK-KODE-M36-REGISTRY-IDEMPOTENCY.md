# M36 Registry Idempotency

For a verified digest D:

- first registration of preserved entry E(D) → `REGISTERED`;
- replay of the same E(D) → `ALREADY_REGISTERED`, registry size unchanged;
- attempted registration of E'(D) where E' differs from E → `REJECTED / DIGEST_CONFLICT`, registry size unchanged.

This behavior makes repeated evidence ingestion safe without silently accepting contradictory metadata.
