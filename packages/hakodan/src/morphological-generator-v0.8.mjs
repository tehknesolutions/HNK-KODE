export const ROLE_MORPHEME_HYPOTHESES = Object.freeze({
  ACTION:'RA', ENTITY:'NA', STATE:'SE', DATA:'DA',
  AGENT:'TA', OPERATOR:'KO', COLLECTION:'LI', TARGET:'MA'
});
const FROZEN = new Set(['AHNUVA','EMANU','HAYA','HODERU','KODAN']);

export function generateRoleCandidates(record) {
  const m = ROLE_MORPHEME_HYPOTHESES[record.role];
  if (!m) throw new Error('MORPH08_UNKNOWN_ROLE');
  const base = record.selected.toUpperCase();
  const root = record.familyRoot.toUpperCase();
  const forms = [base + m, root + m, base + m[0]];
  return forms.map((form,index) => ({
    form: FROZEN.has(form) ? form + 'U' : form,
    variant: ['ROLE_SUFFIX','ROOT_ROLE','COMPACT_ROLE'][index],
    role: record.role, status:'DISCOVERY_CANDIDATE', canon:false
  }));
}

export function scoreRoleCandidate(candidate, record) {
  const morpheme = ROLE_MORPHEME_HYPOTHESES[record.role];
  return {
    roleRegularity: candidate.form.includes(morpheme) ? 30 : 20,
    familyCoherence: candidate.form.startsWith(record.familyRoot) ? 25 : 15,
    compactness: candidate.form.length <= 6 ? 20 : candidate.form.length <= 8 ? 15 : 8,
    distinctness: 15,
    separation: 10
  };
}
