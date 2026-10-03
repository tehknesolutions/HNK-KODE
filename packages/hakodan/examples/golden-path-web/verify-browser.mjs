import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { manifest } from "../../src/manifest-v1.mjs";
import { attachExecutionEvidence } from "../../src/execution-evidence-v1.mjs";

const exec = promisify(execFile);
const source = await readFile(new URL("./abra-island.pt.hnk", import.meta.url), "utf8");
const result = manifest(source, { profile: "PT-BR", target: "web" });
const html = new URL("./abra-island.html", import.meta.url);
await writeFile(html, result.artifact.content, "utf8");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const { stdout } = await exec(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--dump-dom", html.href]);
const required = ["AbraIsland", "Alakazam", '"vida": 100', "Despertar", "despertar"];
const missing = required.filter((token) => !stdout.includes(token));
if (missing.length) throw new Error(`HAKODAN_BROWSER_OBSERVATION_MISSING:${missing.join(",")}`);
const verified = attachExecutionEvidence(result.artifact, {
  ok: true,
  executor: "chrome-headless",
  observed: {
    world: "AbraIsland",
    entity: "Alakazam",
    property: { vida: 100 },
    event: "Despertar",
    action: "despertar"
  }
});

console.log(JSON.stringify({
  status: result.status,
  executionEvidence: verified.executionEvidence,
  executor: verified.execution.executor,
  observed: verified.execution.observed
}, null, 2));