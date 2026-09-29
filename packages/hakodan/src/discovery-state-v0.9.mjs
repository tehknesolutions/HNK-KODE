const TRANSITIONS = new Map([
  ["DISCOVERY:PROPOSE", "PROPOSED"],
  ["PROPOSED:CANDIDATE", "CANDIDATE"],
  ["CANDIDATE:APPROVE", "APPROVED"],
  ["APPROVED:CANONIZE", "CANON"],
  ["DISCOVERY:WATCH", "WATCH"],
  ["PROPOSED:WATCH", "WATCH"],
  ["CANDIDATE:WATCH", "WATCH"],
  ["PROPOSED:REJECT", "REJECTED"],
  ["CANDIDATE:REJECT", "REJECTED"],
  ["CANDIDATE:CONFLICT", "CONFLICT"],
  ["APPROVED:CONFLICT", "CONFLICT"]
]);

export function validateDiscoveryTransition(node, operation) {
  const key = `${node.state}:${operation}`;
  if (TRANSITIONS.has(key)) return { valid: true, nextState: TRANSITIONS.get(key) };
  return { valid: false, diagnostic: `HAKODAN_V09_INVALID_DISCOVERY_TRANSITION: ${node.state} + ${operation}` };
}

export function transitionDiscovery(node, operation, actor) {
  const validation = validateDiscoveryTransition(node, operation);
  if (!validation.valid) throw new Error(validation.diagnostic);
  const history = [...(node.history ?? []), { from: node.state, operation, to: validation.nextState, actor: actor?.id ?? null }];
  return { ...node, state: validation.nextState, history };
}
