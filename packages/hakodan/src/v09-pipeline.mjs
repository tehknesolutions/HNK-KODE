import { parseNarrativeSentence } from "./narrative-sentence-v0.9.mjs";
import { planManifestation } from "./manifestation-graph-v0.9.mjs";
import { registerProjection, roundTripProjection } from "./multimodal-registry-v0.9.mjs";

const CREATE_PROJECTION = {
  semanticId: "ACTION.CREATE",
  text: { en: ["CREATE"], ptBR: ["CRIAR", "CRIAÇÃO", "CRIACAO"], hnk: [] },
  block: { blockType: "ACTION", role: "ACTION", sockets: ["ENTITY", "SCOPE"] }
};

export function runV09VerticalSlice(source, actor) {
  const sentence = parseNarrativeSentence(source);
  const manifestation = planManifestation({
    semanticId: `ENTITY.${sentence.entity.name}`,
    target: "WEB",
    format: "GAME",
    adapter: "PHASER",
    artifact: `dist/${sentence.entity.name.toLowerCase()}`
  }, actor);
  const registry = registerProjection({}, CREATE_PROJECTION);
  const sourceToken = source.trim().split(/\s+/u)[0];
  const projection = roundTripProjection(registry, { surface: "text", value: sourceToken }, "block");
  return { sentence, manifestation, projection };
}
