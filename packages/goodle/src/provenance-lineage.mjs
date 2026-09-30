export function createArtifactRef({ id, type, authority, metadata = {} } = {}) {
  if (!id || !type || !authority) throw new Error("GOODLE_ARTIFACT_IDENTITY_REQUIRED");
  return {
    kind: "ArtifactRef",
    id,
    type,
    authority,
    metadata: structuredClone(metadata),
    provenance: { parents: [], adapter: "HNK-KODE:M4" }
  };
}

export function deriveArtifact(parent, { id, type, authority, metadata = {} } = {}) {
  if (!parent?.id) throw new Error("GOODLE_PARENT_ARTIFACT_REQUIRED");
  const artifact = createArtifactRef({ id, type, authority, metadata });
  artifact.provenance.parents = [parent.id];
  artifact.provenance.parentAuthority = parent.authority;
  return artifact;
}
