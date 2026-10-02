# M38 Reconciliation Summary

Cause: PR #131 used `feat/m37-conformance-attestation` as its base. GitHub correctly marked that PR merged when it merged into that feature branch, but this did not merge M38 into the default `main` branch.

Repair strategy: replay only the M38 repository surfaces onto current `main`, preserving the M37 dependency already present there. This avoids force-moving `main`, avoids pretending PR #131 targeted `main`, and keeps the historical record intact.

After this repair is merged, M39 can be refreshed against `main` and completed normally.
