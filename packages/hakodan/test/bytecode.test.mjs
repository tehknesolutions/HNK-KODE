import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { encodeBytecode, decodeBytecode, bytecodeToBinaryString } from "../src/bytecode.mjs";

const pt = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;

const en = `world AbraIsland {
  entity Alakazam { property vida = 100 }
  event Despertar { action despertar("Alakazam") }
}`;

test("PT-BR e EN geram bytecode byte-for-byte idêntico", () => {
  const a = encodeBytecode(parse(pt, { profile: "PT-BR" }));
  const b = encodeBytecode(parse(en, { profile: "EN" }));
  assert.deepEqual(a, b);
});

test("bytecode v0.1 faz round-trip para HNK-IR", () => {
  const bytes = encodeBytecode(parse(pt, { profile: "PT-BR" }));
  const decoded = decodeBytecode(bytes);
  assert.equal(decoded.format, "haKodan-bytecode");
  assert.deepEqual(decoded.version, { major: 0, minor: 1 });
  assert.equal(decoded.ir.ir, "HNK-IR");
  assert.equal(decoded.ir.world.name, "AbraIsland");
  assert.match(bytecodeToBinaryString(bytes), /^[01]+$/);
});

test("checksum detecta corrupção", () => {
  const bytes = encodeBytecode(parse(pt, { profile: "PT-BR" }));
  const corrupt = bytes.slice();
  corrupt[corrupt.length - 1] ^= 1;
  assert.throws(() => decodeBytecode(corrupt), /CHECKSUM_MISMATCH/);
});

test("magic inválido é rejeitado", () => {
  const bytes = encodeBytecode(parse(pt, { profile: "PT-BR" }));
  const corrupt = bytes.slice();
  corrupt[0] = 0;
  assert.throws(() => decodeBytecode(corrupt), /BAD_MAGIC/);
});
