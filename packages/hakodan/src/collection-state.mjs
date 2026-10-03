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
