import { buildGoldenPath } from "./golden-path-v1.mjs";
import { assertWebTargetSupported } from "./targets/web-target-v1.mjs";
import { buildWebArtifact } from "./targets/web-adapter-v1.mjs";

export function manifest(source, { profile = "PT-BR", target = "web" } = {}) {
  assertWebTargetSupported(target);
  const goldenPath = buildGoldenPath(source, { profile });
  const artifact = buildWebArtifact(goldenPath);

  return Object.freeze({
    goldenPath,
    target,
    artifact,
    status: "ARTIFACT_GENERATED"
  });
}