import { canonicalIrJson } from "./canonical-ir.mjs";

export const HAKODAN_BYTECODE_VERSION = Object.freeze({ major: 0, minor: 1 });
export const HAKODAN_MAGIC = "HAKD";
const HEADER_SIZE = 16;

function fnv1a32(bytes) {
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function encodeBytecode(ast) {
  const payload = new TextEncoder().encode(canonicalIrJson(ast));
  const bytes = new Uint8Array(HEADER_SIZE + payload.length);
  const view = new DataView(bytes.buffer);

  bytes.set(new TextEncoder().encode(HAKODAN_MAGIC), 0);
  view.setUint8(4, HAKODAN_BYTECODE_VERSION.major);
  view.setUint8(5, HAKODAN_BYTECODE_VERSION.minor);
  view.setUint16(6, 0, false);
  view.setUint32(8, payload.length, false);
  view.setUint32(12, fnv1a32(payload), false);
  bytes.set(payload, HEADER_SIZE);

  return bytes;
}

export function decodeBytecode(bytesLike) {
  const bytes = bytesLike instanceof Uint8Array ? bytesLike : new Uint8Array(bytesLike);
  if (bytes.length < HEADER_SIZE) throw new Error("HAKODAN_BYTECODE_TRUNCATED");

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const magic = new TextDecoder().decode(bytes.slice(0, 4));
  if (magic !== HAKODAN_MAGIC) throw new Error("HAKODAN_BYTECODE_BAD_MAGIC");

  const major = view.getUint8(4);
  const minor = view.getUint8(5);
  if (major !== 0 || minor !== 1) {
    throw new Error(`HAKODAN_BYTECODE_UNSUPPORTED_VERSION: ${major}.${minor}`);
  }

  const flags = view.getUint16(6, false);
  const payloadLength = view.getUint32(8, false);
  const expectedChecksum = view.getUint32(12, false);
  if (bytes.length !== HEADER_SIZE + payloadLength) {
    throw new Error("HAKODAN_BYTECODE_LENGTH_MISMATCH");
  }

  const payload = bytes.slice(HEADER_SIZE);
  const actualChecksum = fnv1a32(payload);
  if (actualChecksum !== expectedChecksum) {
    throw new Error("HAKODAN_BYTECODE_CHECKSUM_MISMATCH");
  }

  let ir;
  try {
    ir = JSON.parse(new TextDecoder().decode(payload));
  } catch {
    throw new Error("HAKODAN_BYTECODE_INVALID_PAYLOAD");
  }

  if (ir?.ir !== "HNK-IR") throw new Error("HAKODAN_BYTECODE_NOT_HNK_IR");

  return {
    format: "haKodan-bytecode",
    version: { major, minor },
    flags,
    checksum: expectedChecksum,
    ir
  };
}

export function bytecodeToBinaryString(bytesLike) {
  return Array.from(bytesLike, byte => byte.toString(2).padStart(8, "0")).join("");
}
