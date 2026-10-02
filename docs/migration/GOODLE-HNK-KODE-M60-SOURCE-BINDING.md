# M60 Source Binding

Each M59 registry entry must satisfy:

`entry.sourceDigest === entry.archive.sourceDigest === entry.archive.seal.digest`

and:

`entry.digest === entry.archive.digest`

This prevents a registry entry from presenting an archive identity detached from its embedded seal lineage.
