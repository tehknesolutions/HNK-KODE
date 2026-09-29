// haKodan Mora-Kodin generator v0.4
// Deterministic discovery generator. It MUST NOT promote lexical canon.
// Authoritative generated dataset: data/lexicon/haKodan-mora-kodin-candidates-v0.4.json
//
// Design rules:
// - canonical AHNUVA/EMANU/HAYA/HODERU/KODAN are frozen;
// - reference languages provide structural inspiration only;
// - semantic meaning comes from Semantic ID / HNK authority, never phonetic resemblance;
// - output status is DISCOVERY_CANDIDATE.
//
// This repository snapshot stores the generated output and report. The exact
// production algorithm is intentionally kept deterministic and dependency-free.
// Re-implementation must preserve the invariants documented in the dataset:
// 122 concepts, 3 candidates each, no automatic canon promotion, unique forms,
// and explicit Creator Gate before promotion.

export const MORA_KODIN_V04 = Object.freeze({
  schema: "MORA-KODIN-DISCOVERY/V0.4",
  source: "data/lexicon/VHK_HNK_lexical_shortlist_v0.2.json",
  canonicalFrozen: Object.freeze(["AHNUVA","EMANU","HAYA","HODERU","KODAN"]),
  candidateStatus: "DISCOVERY_CANDIDATE",
  promotionRequires: "CREATOR_GATE",
  patterns: Object.freeze(["V","CV","CV.N","CV.CV","CV.CV.CV","V.CV.CV"])
});

export function assertMoraKodinBatch(batch) {
  if (batch.schemaVersion !== MORA_KODIN_V04.schema) throw new Error("MORA_SCHEMA");
  if (batch.concepts !== 122) throw new Error("MORA_CONCEPT_COUNT");
  if (batch.candidates !== 366) throw new Error("MORA_CANDIDATE_COUNT");
  if (batch.canonPromotions !== 0) throw new Error("MORA_CANON_PROMOTION_FORBIDDEN");
  if (!batch.allCandidateFormsUnique) throw new Error("MORA_DUPLICATE_FORM");
  for (const item of batch.items) {
    if (item.canon !== false || item.status !== "DISCOVERY_CANDIDATE") throw new Error("MORA_STATUS");
    if (!Array.isArray(item.candidates) || item.candidates.length !== 3) throw new Error("MORA_VARIANT_COUNT");
    if (MORA_KODIN_V04.canonicalFrozen.includes(item.previousProvisional)) throw new Error("MORA_CANON_REGENERATED");
  }
  return true;
}
