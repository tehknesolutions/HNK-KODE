import { getCollection } from "./collection-state.mjs";
import { setStatePath } from "./state-path.mjs";

function quantity(value, label = "quantity") {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`HAKODAN_ITEM_QUANTITY_INVALID: ${label}`);
  return value;
}

function sumQuantity(left, right, label) {
  const result = left + right;
  quantity(result, label);
  return result;
}

function itemId(id) {
  if (typeof id !== "string" || !id) throw new Error("HAKODAN_ITEM_ID_REQUIRED");
  return id;
}

function canonicalValue(value, path = "metadata") {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`HAKODAN_ITEM_METADATA_INVALID: ${path}`);
    return Object.is(value, -0) ? 0 : value;
  }
  if (Array.isArray(value)) return value.map((item, index) => canonicalValue(item, `${path}[${index}]`));
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalValue(value[key], `${path}.${key}`)]));
  }
  throw new Error(`HAKODAN_ITEM_METADATA_INVALID: ${path}`);
}

function validateStack(stack) {
  if (!stack || typeof stack !== "object" || Array.isArray(stack)) throw new Error("HAKODAN_ITEM_STACK_INVALID");
  itemId(stack.id);
  quantity(stack.quantity, `${stack.id}.quantity`);
  canonicalItemMetadata(stack);
  return stack;
}

export function canonicalItemMetadata(stack) {
  if (!stack || typeof stack !== "object" || Array.isArray(stack)) throw new Error("HAKODAN_ITEM_STACK_INVALID");
  const metadata = {};
  for (const key of Object.keys(stack).filter(key => key !== "id" && key !== "quantity").sort()) metadata[key] = canonicalValue(stack[key], `${stack.id ?? "item"}.${key}`);
  return metadata;
}

export function itemStacksCompatible(left, right) {
  if (!left || !right || left.id !== right.id) return false;
  return JSON.stringify(canonicalItemMetadata(left)) === JSON.stringify(canonicalItemMetadata(right));
}

function assertCompatible(left, right, id) {
  if (!itemStacksCompatible(left, right)) throw new Error(`HAKODAN_ITEM_STACK_INCOMPATIBLE: ${id}`);
}

export function getItemStack(subject, path, id) {
  itemId(id);
  const inventory = getCollection(subject, path);
  const matches = inventory.filter(stack => validateStack(stack).id === id);
  if (matches.length > 1) throw new Error(`HAKODAN_ITEM_DUPLICATE_ID: ${id}`);
  return matches[0] ?? null;
}

export function itemCount(subject, path, id) { return getItemStack(subject, path, id)?.quantity ?? 0; }
export function hasItem(subject, path, id, minimum = 1) { quantity(minimum, "minimum"); return itemCount(subject, path, id) >= minimum; }
function replaceInventory(subject, path, inventory) { setStatePath(subject, path, structuredClone(inventory)); }

export function addItem(subject, path, id, amount = 1, metadata = undefined) {
  itemId(id); quantity(amount);
  if (amount === 0) return null;
  const inventory = getCollection(subject, path);
  const current = getItemStack(subject, path, id);
  const candidate = { id, quantity: amount, ...(metadata === undefined ? {} : canonicalValue(metadata, `${id}.metadata`)) };
  if (current && metadata !== undefined) assertCompatible(current, candidate, id);
  const before = structuredClone(inventory);
  const after = current
    ? before.map(stack => stack.id === id ? { ...stack, quantity: sumQuantity(stack.quantity, amount, `${id}.quantity`) } : stack)
    : [...before, candidate];
  replaceInventory(subject, path, after);
  return { before, after, id, quantity: amount };
}

export function removeItem(subject, path, id, amount = 1) {
  itemId(id); quantity(amount);
  if (amount === 0) return null;
  const inventory = getCollection(subject, path);
  const current = getItemStack(subject, path, id);
  if (!current || current.quantity < amount) throw new Error(`HAKODAN_ITEM_INSUFFICIENT_QUANTITY: ${id}`);
  const before = structuredClone(inventory);
  const remaining = current.quantity - amount;
  const after = remaining === 0 ? before.filter(stack => stack.id !== id) : before.map(stack => stack.id === id ? { ...stack, quantity: remaining } : stack);
  replaceInventory(subject, path, after);
  return { before, after, id, quantity: amount };
}

export function transferItem(source, sourcePath, target, targetPath, id, amount = 1) {
  itemId(id); quantity(amount);
  if (amount === 0 || (source === target && sourcePath === targetPath)) return null;
  const sourceInventory = getCollection(source, sourcePath);
  const targetInventory = getCollection(target, targetPath);
  const sourceStack = getItemStack(source, sourcePath, id);
  const targetStack = getItemStack(target, targetPath, id);
  if (!sourceStack || sourceStack.quantity < amount) throw new Error(`HAKODAN_ITEM_INSUFFICIENT_QUANTITY: ${id}`);
  if (targetStack) {
    assertCompatible(sourceStack, targetStack, id);
    sumQuantity(targetStack.quantity, amount, `${id}.quantity`);
  }

  const sourceBefore = structuredClone(sourceInventory);
  const targetBefore = structuredClone(targetInventory);
  const remaining = sourceStack.quantity - amount;
  const sourceAfter = remaining === 0 ? sourceBefore.filter(stack => stack.id !== id) : sourceBefore.map(stack => stack.id === id ? { ...stack, quantity: remaining } : stack);
  const targetAfter = targetStack
    ? targetBefore.map(stack => stack.id === id ? { ...stack, quantity: sumQuantity(stack.quantity, amount, `${id}.quantity`) } : stack)
    : [...targetBefore, { ...structuredClone(sourceStack), quantity: amount }];

  replaceInventory(source, sourcePath, sourceAfter);
  try { replaceInventory(target, targetPath, targetAfter); }
  catch (error) { replaceInventory(source, sourcePath, sourceBefore); throw error; }
  return { id, quantity: amount, sourceBefore, sourceAfter, targetBefore, targetAfter };
}
