import { getCollection } from "./collection-state.mjs";
import { setStatePath } from "./state-path.mjs";

function instanceId(value) {
  if (typeof value !== "string" || !value) throw new Error("HAKODAN_ITEM_INSTANCE_ID_REQUIRED");
  return value;
}

function validateInstance(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("HAKODAN_ITEM_INSTANCE_INVALID");
  if (typeof item.id !== "string" || !item.id) throw new Error("HAKODAN_ITEM_ID_REQUIRED");
  instanceId(item.instanceId);
  if (item.quantity !== 1) throw new Error(`HAKODAN_ITEM_INSTANCE_QUANTITY_INVALID: ${item.instanceId}`);
  return item;
}

function inventoryInstances(subject, path) {
  const inventory = getCollection(subject, path);
  const seen = new Set();
  for (const item of inventory) {
    if (!item || typeof item !== "object" || Array.isArray(item) || item.instanceId === undefined) continue;
    validateInstance(item);
    if (seen.has(item.instanceId)) throw new Error(`HAKODAN_ITEM_INSTANCE_DUPLICATE: ${item.instanceId}`);
    seen.add(item.instanceId);
  }
  return inventory;
}

function replaceInventory(subject, path, inventory) { setStatePath(subject, path, structuredClone(inventory)); }

export function getItemInstance(subject, path, id) {
  instanceId(id);
  const inventory = inventoryInstances(subject, path);
  return inventory.find(item => item && typeof item === "object" && item.instanceId === id) ?? null;
}

export function hasItemInstance(subject, path, id) { return getItemInstance(subject, path, id) !== null; }

export function addItemInstance(subject, path, item) {
  validateInstance(item);
  const inventory = inventoryInstances(subject, path);
  if (getItemInstance(subject, path, item.instanceId)) throw new Error(`HAKODAN_ITEM_INSTANCE_DUPLICATE: ${item.instanceId}`);
  const before = structuredClone(inventory);
  const after = [...before, structuredClone(item)];
  replaceInventory(subject, path, after);
  return { id:item.id, instanceId:item.instanceId, before, after };
}

export function removeItemInstance(subject, path, id) {
  instanceId(id);
  const inventory = inventoryInstances(subject, path);
  const current = getItemInstance(subject, path, id);
  if (!current) throw new Error(`HAKODAN_ITEM_INSTANCE_NOT_FOUND: ${id}`);
  const before = structuredClone(inventory);
  const after = before.filter(item => !(item && typeof item === "object" && item.instanceId === id));
  replaceInventory(subject, path, after);
  return { id:current.id, instanceId:id, item:structuredClone(current), before, after };
}

export function transferItemInstance(source, sourcePath, target, targetPath, id) {
  instanceId(id);
  if (source === target && sourcePath === targetPath) return null;
  const sourceInventory = inventoryInstances(source, sourcePath);
  const targetInventory = inventoryInstances(target, targetPath);
  const current = getItemInstance(source, sourcePath, id);
  if (!current) throw new Error(`HAKODAN_ITEM_INSTANCE_NOT_FOUND: ${id}`);
  if (getItemInstance(target, targetPath, id)) throw new Error(`HAKODAN_ITEM_INSTANCE_DUPLICATE: ${id}`);

  const sourceBefore = structuredClone(sourceInventory);
  const targetBefore = structuredClone(targetInventory);
  const sourceAfter = sourceBefore.filter(item => !(item && typeof item === "object" && item.instanceId === id));
  const targetAfter = [...targetBefore, structuredClone(current)];

  replaceInventory(source, sourcePath, sourceAfter);
  try { replaceInventory(target, targetPath, targetAfter); }
  catch (error) { replaceInventory(source, sourcePath, sourceBefore); throw error; }
  return { id:current.id, instanceId:id, item:structuredClone(current), sourceBefore, sourceAfter, targetBefore, targetAfter };
}
