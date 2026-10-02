# M60 Canonicalization

Registry entries are sorted lexicographically by `digest` before the seal payload is serialized.

The canonical payload contains:

- `version`
- `kind`
- `protocol`
- `evidenceClass`
- `entryCount`
- `entries`

SHA-256 is computed over `JSON.stringify(payload)` before `digest` is appended.
