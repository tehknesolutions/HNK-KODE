# M36 Registry Rejection Matrix

| Condition | Result |
| --- | --- |
| status is not `IMPORTED_VERIFIED` | `REJECTED / M35_VERIFIED_IMPORT_REQUIRED` |
| verification is not valid | `REJECTED / M35_VERIFIED_IMPORT_REQUIRED` |
| verified bundle digest missing | `REJECTED / M35_VERIFIED_IMPORT_REQUIRED` |
| digest already exists with different preserved metadata | `REJECTED / DIGEST_CONFLICT` |
| digest already exists with identical preserved metadata | `ALREADY_REGISTERED` |
| new valid verified digest | `REGISTERED` |
