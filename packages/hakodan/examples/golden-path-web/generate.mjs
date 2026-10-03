import { readFile, writeFile } from "node:fs/promises";
import { manifest } from "../../src/manifest-v1.mjs";

const source = await readFile(new URL("./abra-island.pt.hnk", import.meta.url), "utf8");
const result = manifest(source, { profile: "PT-BR", target: "web" });
const output = new URL("./abra-island.html", import.meta.url);
await writeFile(output, result.artifact.content, "utf8");
console.log(JSON.stringify({
  status: result.status,
  executionEvidence: result.artifact.executionEvidence,
  output: output.pathname
}));