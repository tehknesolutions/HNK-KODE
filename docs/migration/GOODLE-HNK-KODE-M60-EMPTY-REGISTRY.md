# M60 Empty Registry

A structurally valid M59 registry with zero entries is sealable.

Its M60 payload has `entryCount: 0` and `entries: []`, producing the same digest for every equivalent empty M59 registry state.
