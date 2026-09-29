import fs from 'node:fs';
const url = new URL('../../../data/lexicon/haKodan-morphological-roles-v0.8.json', import.meta.url);
const registry = JSON.parse(fs.readFileSync(url, 'utf8'));
export const ROLE_IDS = Object.freeze([...registry.roles]);
export const assignments = Object.freeze(registry.assignments.map(x => Object.freeze({...x})));
const byId = new Map(assignments.map(x => [x.semanticId, x]));
export function getRoleForSemanticId(semanticId) {
  const hit = byId.get(semanticId);
  if (!hit) throw new Error(`UNKNOWN_SEMANTIC_ID:${semanticId}`);
  return hit.role;
}
export function validateRoleAssignment(record) {
  const diagnostics = [];
  const known = byId.get(record?.semanticId);
  if (!known) diagnostics.push(`UNKNOWN_SEMANTIC_ID:${record?.semanticId ?? ''}`);
  else if (!ROLE_IDS.includes(record?.role)) diagnostics.push(`UNKNOWN_ROLE:${record?.role ?? ''}`);
  else if (known.role !== record.role) diagnostics.push(`ROLE_MISMATCH:${known.role}:${record.role}`);
  return { ok: diagnostics.length === 0, diagnostics };
}
export default registry;