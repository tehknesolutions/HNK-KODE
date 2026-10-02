# M36 Registry API

`createVerifiedBundleRegistry()` returns a frozen API object:

- `register(importResult)`
- `get(digest)`
- `snapshot()`
- `size()`

The API intentionally has no update/delete/execute/approve methods.
