import { assertWebTargetSupported } from "./web-target-v1.mjs";

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function buildWebArtifact(goldenPath) {
  assertWebTargetSupported("web");
  if (!goldenPath?.ir?.world) {
    throw new Error("HAKODAN_WEB_INVALID_GOLDEN_PATH");
  }
  const world = goldenPath.ir.world;
  const data = escapeJson(world);
  const content = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>haKodan — ${world.name}</title></head>
<body><main id="hakodan-root"></main>
<script>const world=${data};
const root=document.getElementById("hakodan-root");
root.innerHTML='<h1>'+world.name+'</h1><pre>'+JSON.stringify(world,null,2)+'</pre>';
window.__HAKODAN_WORLD__=world;</script></body></html>`;

  return Object.freeze({
    target: "web",
    mediaType: "text/html",
    executionEvidence: "UNVERIFIED",
    content
  });
}