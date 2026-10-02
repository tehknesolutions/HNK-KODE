# M36 Registry Notes

Issue: #128

The verified-bundle registry is intentionally downstream of M35 import verification. It catalogs already-verified conformance bundles by their verified digest.

The registry does not recompute authority, does not dispatch manifestations, does not claim runtime execution, and does not promote canon. Exact duplicate registration is idempotent; conflicting content under an existing digest is rejected.
