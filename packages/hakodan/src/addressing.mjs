export function objectAddress(homObject) {
  const id = homObject?.identity?.id;
  if (!id) throw new Error("HAKODAN_ADDRESS_OBJECT_INVALID");
  return id;
}

export function propertyAddress(homObject, propertyName) {
  const base = objectAddress(homObject);
  if (!propertyName || !(propertyName in (homObject.properties ?? {}))) {
    throw new Error(`HAKODAN_ADDRESS_PROPERTY_UNKNOWN: ${propertyName}`);
  }
  return `${base}/property/${propertyName}`;
}

export function componentAddress(homObject, componentId) {
  const base = objectAddress(homObject);
  const attachments = homObject.data?.componentAttachments ?? [];
  if (!attachments.some(x => x.componentId === componentId)) {
    throw new Error(`HAKODAN_ADDRESS_COMPONENT_UNKNOWN: ${componentId}`);
  }
  return `${base}/component/${componentId}`;
}

export function buildAddressTable(hom) {
  const entries = [];
  const seen = new Set();

  const add = (address, kind, owner = null) => {
    if (seen.has(address)) throw new Error(`HAKODAN_ADDRESS_DUPLICATE: ${address}`);
    const entry = { index: entries.length, address, kind, owner };
    entries.push(entry);
    seen.add(address);
    return entry;
  };

  for (const object of [...hom.objects].sort((a,b)=>a.identity.id.localeCompare(b.identity.id))) {
    const base = objectAddress(object);
    add(base, object.type, null);

    for (const name of Object.keys(object.properties ?? {}).sort()) {
      add(propertyAddress(object, name), "Property", base);
    }

    for (const attachment of [...(object.data?.componentAttachments ?? [])].sort((a,b)=>a.componentId.localeCompare(b.componentId))) {
      add(componentAddress(object, attachment.componentId), "Component", base);
    }
  }

  return entries;
}

export function resolveAddress(addressTable, address) {
  const entry = addressTable.find(x => x.address === address);
  if (!entry) throw new Error(`HAKODAN_ADDRESS_NOT_FOUND: ${address}`);
  return entry;
}
