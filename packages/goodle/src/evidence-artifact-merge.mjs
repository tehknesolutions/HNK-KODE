function key(record = {}) { return JSON.stringify([record.semanticId ?? null, record.observationId ?? null, record.state ?? null]); }

export function applyAuditMergePlan(left = {}, right = {}, plan = {}) {
  if (plan?.version !== 'm22-v1') return Object.freeze({ status: 'REJECTED', artifact: null, reason: 'INVALID_PLAN' });
  if (plan.conflicts?.length && plan.policy === 'REQUIRED') return Object.freeze({ status: 'REJECTED', artifact: null, reason: 'UNRESOLVED_CONFLICTS' });
  const leftMap = new Map((left.records ?? []).map((r) => [key(r), r]));
  const rightMap = new Map((right.records ?? []).map((r) => [key(r), r]));
  const result = [];
  for (const record of leftMap.values()) {
    const k = key(record);
    if (plan.retained?.some((x) => x.key === k && x.source === 'right')) continue;
    if (plan.removals?.some((x) => x.key === k)) continue;
    result.push({ ...record });
  }
  for (const record of rightMap.values()) {
    const k = key(record);
    if (plan.additions?.some((x) => x.key === k)) result.push({ ...record });
    if (plan.retained?.some((x) => x.key === k && x.source === 'right')) result.push({ ...record });
  }
  const operations = Object.freeze({
    unchanged: Object.freeze([...(plan.unchanged ?? [])]), retained: Object.freeze([...(plan.retained ?? [])]),
    additions: Object.freeze([...(plan.additions ?? [])]), removals: Object.freeze([...(plan.removals ?? [])]), conflicts: Object.freeze([...(plan.conflicts ?? [])])
  });
  return Object.freeze({ status: 'MERGED', artifact: Object.freeze({ version: 'm23-v1', kind: 'GOODLE_AUDIT_ARTIFACT', records: Object.freeze(result.map((r) => Object.freeze(r))), mergeAudit: Object.freeze({ sourcePlans: operations }) }), operations });
}