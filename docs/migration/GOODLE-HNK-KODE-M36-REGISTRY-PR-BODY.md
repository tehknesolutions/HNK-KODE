# Proposed PR Body — M36 Registry

Tracks #128.

Adds deterministic cataloging for M35 verified conformance bundles. Registration is keyed by the verified bundle digest, exact replay is idempotent, same-digest conflicting preserved metadata is rejected, and stored entries/snapshots are immutable at the caller boundary. Public API export and focused tests are included.

Governance: registry membership is audit/catalog evidence only and grants no execution, canon, or governance authority.

Verification: static contract is repository-visible; executable Node suite remains NOT_RUN without fresh stdout/stderr + exit code.

Bookkeeping: Issue #125 already carries the M36 label for the conformance round-trip gate. Both histories are preserved and the numbering collision is documented rather than silently renumbered.
