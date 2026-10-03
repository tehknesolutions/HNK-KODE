function segments(path) {
  if (typeof path !== "string" || !path.trim()) throw new Error("HAKODAN_STATE_PATH_INVALID");
  const parts = path.split(".");
  if (parts.some(part => !part || part === "__proto__" || part === "prototype" || part === "constructor")) {
    throw new Error(`HAKODAN_STATE_PATH_UNSAFE: ${path}`);
  }
  return parts;
}

export function getStatePath(subject, path) {
  let cursor = subject;
  for (const key of segments(path)) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = cursor[key];
  }
  return cursor;
}

export function setStatePath(subject, path, value) {
  const parts = segments(path);
  let cursor = subject;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (cursor[key] == null) cursor[key] = {};
    if (typeof cursor[key] !== "object" || Array.isArray(cursor[key])) throw new Error(`HAKODAN_STATE_PATH_NOT_OBJECT: ${parts.slice(0, index + 1).join(".")}`);
    cursor = cursor[key];
  }
  const key = parts.at(-1);
  const before = structuredClone(cursor[key]);
  cursor[key] = structuredClone(value);
  return { before, after: structuredClone(value) };
}
