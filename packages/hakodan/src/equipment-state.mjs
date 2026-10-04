import { getStatePath, setStatePath } from "./state-path.mjs";
import { getItemInstance, addItemInstance, removeItemInstance } from "./item-instance-state.mjs";

function slotName(slot) {
  if (typeof slot !== "string" || !slot) throw new Error("HAKODAN_EQUIPMENT_SLOT_REQUIRED");
  return slot;
}
function slotPath(path, slot) { return `${path}.${slotName(slot)}`; }
function clone(value) { return structuredClone(value); }

export function getEquippedInstance(subject, equipmentPath, slot) {
  const value = getStatePath(subject, slotPath(equipmentPath, slot));
  return value ?? null;
}

export function isInstanceEquipped(subject, equipmentPath, instanceId) {
  const equipment = getStatePath(subject, equipmentPath);
  if (!equipment || typeof equipment !== "object" || Array.isArray(equipment)) return false;
  return Object.values(equipment).some(item => item && typeof item === "object" && item.instanceId === instanceId);
}

export function isEquipmentSlotEmpty(subject, equipmentPath, slot) {
  return getEquippedInstance(subject, equipmentPath, slot) === null;
}

export function equipItemInstance(subject, inventoryPath, equipmentPath, instanceId, slot) {
  slotName(slot);
  const item = getItemInstance(subject, inventoryPath, instanceId);
  if (!item) throw new Error(`HAKODAN_EQUIPMENT_INSTANCE_NOT_FOUND: ${instanceId}`);
  if (item.slot !== undefined && item.slot !== slot) throw new Error(`HAKODAN_EQUIPMENT_SLOT_INCOMPATIBLE: ${instanceId}`);
  if (!isEquipmentSlotEmpty(subject, equipmentPath, slot)) throw new Error(`HAKODAN_EQUIPMENT_SLOT_OCCUPIED: ${slot}`);
  if (isInstanceEquipped(subject, equipmentPath, instanceId)) throw new Error(`HAKODAN_ITEM_INSTANCE_DUPLICATE: ${instanceId}`);

  const inventoryBefore = clone(getStatePath(subject, inventoryPath));
  const slotBefore = getEquippedInstance(subject, equipmentPath, slot);
  const removed = removeItemInstance(subject, inventoryPath, instanceId);
  try { setStatePath(subject, slotPath(equipmentPath, slot), clone(item)); }
  catch (error) { setStatePath(subject, inventoryPath, inventoryBefore); throw error; }
  return { id:item.id, instanceId, slot, item:clone(item), inventoryBefore, inventoryAfter:removed.after, slotBefore, slotAfter:clone(item) };
}

export function unequipItemInstance(subject, equipmentPath, slot, inventoryPath) {
  slotName(slot);
  const item = getEquippedInstance(subject, equipmentPath, slot);
  if (!item || typeof item !== "object" || !item.instanceId) throw new Error(`HAKODAN_EQUIPMENT_INSTANCE_NOT_FOUND: ${slot}`);
  if (getItemInstance(subject, inventoryPath, item.instanceId)) throw new Error(`HAKODAN_ITEM_INSTANCE_DUPLICATE: ${item.instanceId}`);

  const inventoryBefore = clone(getStatePath(subject, inventoryPath));
  const slotBefore = clone(item);
  addItemInstance(subject, inventoryPath, clone(item));
  try { setStatePath(subject, slotPath(equipmentPath, slot), null); }
  catch (error) { setStatePath(subject, inventoryPath, inventoryBefore); throw error; }
  return { id:item.id, instanceId:item.instanceId, slot, item:clone(item), inventoryBefore, inventoryAfter:clone(getStatePath(subject, inventoryPath)), slotBefore, slotAfter:null };
}
