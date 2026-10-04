import { getStatePath, setStatePath } from "./state-path.mjs";

export function getCollection(subject, path) {
  const value = getStatePath(subject, path);
  if (!Array.isArray(value)) throw new Error(`HAKODAN_COLLECTION_ARRAY_REQUIRED: ${path}`);
  return value;
}

export function collectionHas(subject, path, value) {
  return getCollection(subject, path).some(item => Object.is(item, value));
}

export function collectionCount(subject, path, value) {
  const collection = getCollection(subject, path);
  if (value === undefined) return collection.length;
  return collection.reduce((count, item) => count + (Object.is(item, value) ? 1 : 0), 0);
}

export function addCollectionItem(subject, path, value) {
  const before = structuredClone(getCollection(subject, path));
  const after = [...before, structuredClone(value)];
  setStatePath(subject, path, after);
  return { before, after };
}

export function removeCollectionItem(subject, path, value, all = false) {
  const before = structuredClone(getCollection(subject, path));
  let removed = false;
  const after = before.filter(item => {
    if (!Object.is(item, value)) return true;
    if (all) return false;
    if (!removed) { removed = true; return false; }
    return true;
  });
  if (before.length === after.length) return null;
  setStatePath(subject, path, after);
  return { before, after };
}

function assertWritableCollectionPath(subject, path) {
  const parts = path.split(".");
  let cursor = subject;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (cursor?.[key] == null || typeof cursor[key] !== "object" || Array.isArray(cursor[key])) {
      throw new Error(`HAKODAN_STATE_PATH_NOT_OBJECT: ${parts.slice(0, index + 1).join(".")}`);
    }
    cursor = cursor[key];
  }
}

export function transferCollectionItem(source, sourcePath, target, targetPath, value, all = false) {
  const sourceBefore = structuredClone(getCollection(source, sourcePath));
  const targetBefore = structuredClone(getCollection(target, targetPath));
  assertWritableCollectionPath(source, sourcePath);
  assertWritableCollectionPath(target, targetPath);

  if (source === target && sourcePath === targetPath) return null;

  const matches = sourceBefore.filter(item => Object.is(item, value));
  if (matches.length === 0) return null;

  const moved = all ? matches : [matches[0]];
  let removed = 0;
  const removeLimit = all ? Infinity : 1;
  const sourceAfter = sourceBefore.filter(item => {
    if (!Object.is(item, value) || removed >= removeLimit) return true;
    removed += 1;
    return false;
  });
  const targetAfter = [...targetBefore, ...moved.map(item => structuredClone(item))];

  setStatePath(source, sourcePath, sourceAfter);
  try {
    setStatePath(target, targetPath, targetAfter);
  } catch (error) {
    setStatePath(source, sourcePath, sourceBefore);
    throw error;
  }
  return { sourceBefore, sourceAfter, targetBefore, targetAfter, moved: structuredClone(moved) };
}
