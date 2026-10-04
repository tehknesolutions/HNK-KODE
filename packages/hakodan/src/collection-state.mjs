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
  const sourceLive = getCollection(source, sourcePath);
  const targetLive = getCollection(target, targetPath);
  assertWritableCollectionPath(source, sourcePath);
  assertWritableCollectionPath(target, targetPath);

  if (source === target && sourcePath === targetPath) return null;

  const matchIndices = [];
  for (let index = 0; index < sourceLive.length; index += 1) {
    if (Object.is(sourceLive[index], value)) matchIndices.push(index);
  }
  if (matchIndices.length === 0) return null;

  const selectedIndices = all ? matchIndices : [matchIndices[0]];
  const selected = new Set(selectedIndices);
  const movedLive = selectedIndices.map(index => sourceLive[index]);
  const sourceBefore = structuredClone(sourceLive);
  const targetBefore = structuredClone(targetLive);
  const sourceAfter = structuredClone(sourceLive.filter((_, index) => !selected.has(index)));
  const moved = structuredClone(movedLive);
  const targetAfter = [...targetBefore, ...structuredClone(movedLive)];

  setStatePath(source, sourcePath, sourceAfter);
  try {
    setStatePath(target, targetPath, targetAfter);
  } catch (error) {
    setStatePath(source, sourcePath, sourceBefore);
    throw error;
  }
  return { sourceBefore, sourceAfter, targetBefore, targetAfter, moved };
}
