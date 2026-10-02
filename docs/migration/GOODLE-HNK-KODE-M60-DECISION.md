# M60 Architectural Decision

Decision: keep registry sealing and independent seal import/verification as separate milestones.

Reason: the producer of an integrity artifact should not be treated as the sole authority that validates its own transport boundary. M60 creates/verifies local seal integrity; M61 will establish the independent import boundary.
