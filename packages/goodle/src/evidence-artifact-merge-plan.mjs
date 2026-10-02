import { verifyArtifactLineage } from './evidence-artifact-lineage.mjs';

function key(record = {}) { return JSON.stringify([record.semanticId ?? null, record.observationId ?? null, record.state ?? null]); }

export function planAuditArtifactMerge(left = {}, right = {}, policy = {}) {
  const lineage = verifyArtifactLineage(left, right);
  if (lineage.status !== 'COMPATIBLE') return Object.freeze({ status: 'REJECTED', plan: null, reason: lineage.reason });
  const l = new Map((left.records ?? []).map((r) => [key(r), r]));
  const r = new Map((right.records ?? []).map((r) => [key(r), r]));
  const unchanged = []; const retained = []; const additions = []; const removals = []; const conflicts = [];
  for (const [k, rr] of r) {
    if (!l.has(k)) { additions.push({ key: k, record: { ...rr } }); continue; }
    const ll = l.get(k);
    if (JSON.stringify(ll) === JSON.stringify(rr)) unchanged.push(k);
    else if (policy.resolve === 'right' || policy.resolve === 'left') retained.push({ key: k, source: policy.resolve });
    else conflicts.push({ key: k, left: { ...ll }, right: { ...rr }, resolution: 'REQUIRED' });
  }
  for (const [k, ll] of l) if (!r.has(k)) removals.push({ key: k, record: { ...ll } });
  const plan = Object.freeze({
    version: 'm22-v1', policy: policy.resolve ?? 'REQUIRED',
    unchanged: Object.freeze(unchanged), retained: Object.freeze(retained),
    additions: Object.freeze(additions.map((x) => Object.freeze(x))),
    removals: Object.freeze(removals.map((x) => Object.freeze(x))),
    conflicts: Object.freeze(conflicts.map((x) => Object.freeze(x))),
  });
  return Object.freeze({ status: conflicts.length && !policy.resolve ? 'CONFLICTS_REQUIRE_RESOLUTION' : 'PLANNED', plan });
}