import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse, toHnkIr } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";
import { compileHtmlDocument } from "../src/target-html-document.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "primeira-manifestacao.hakodan");
const outputPath = join(here, "primeira-manifestacao.html");
const source = await readFile(sourcePath, "utf8");
const ast = parse(source, { profile: "PT-BR" });
const ir = toHnkIr(ast);
const hom = toHom(ast);
const html = compileHtmlDocument({ ir, hom });
await writeFile(outputPath, html, "utf8");
console.log(`HAKODAN_MANIFESTATION_ARTIFACT=${outputPath}`);
