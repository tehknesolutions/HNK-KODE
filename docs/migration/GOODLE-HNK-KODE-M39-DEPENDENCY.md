# M39 Dependency Note

M39 depends on the M38 attestation import boundary. PR #131 was merged into the M37 feature branch rather than into `main`, so M38 is being reconciled separately by `fix/reconcile-m38-main`.

Do not merge M39 until the M38 reconciliation lands on `main`. After that, refresh/rebase the M39 lineage and expose both the M38 import and M39 round-trip modules from the public index.

No executable PASS is implied by this dependency record.
