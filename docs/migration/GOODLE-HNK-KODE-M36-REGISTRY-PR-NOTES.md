# M36 Registry PR Notes

Proposed PR title: `M36 registry — verified bundle catalog + duplicate/conflict semantics`.

Review summary: introduces one Goodle registry module, focused tests, public export and audit documentation. It accepts only M35 verified imports, keys by verified digest, makes exact replay idempotent, rejects same-digest conflicting metadata, and does not grant execution/canon authority.

Important: Issue #125 already uses the M36 label for the round-trip gate. The collision is explicitly preserved and documented rather than silently renumbered.
