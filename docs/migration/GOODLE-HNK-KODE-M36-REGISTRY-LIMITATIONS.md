# M36 Registry Limitations

This slice does not provide persistent database storage across process restarts; the registry is an in-memory repository/runtime abstraction. It does not expose deletion, mutation, replication, remote synchronization, execution dispatch, authorization, or canon promotion.

Those capabilities, if ever desired, require separate explicit milestones and authority contracts rather than being inferred from M36 registry membership.
