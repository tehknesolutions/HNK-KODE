# M60 Security Notes

M60 rejects structural ambiguity before hashing: invalid M59 identity, protocol mutation, evidence-class mutation, invalid nested archive binding, and duplicate archive digests.

Canonical ordering prevents insertion-order variance from producing distinct logical seals.

The digest is SHA-256 over the complete canonical payload excluding only the digest field itself.
