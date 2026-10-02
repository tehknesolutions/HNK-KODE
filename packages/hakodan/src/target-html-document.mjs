const TARGET_ID = "hakodan.target.html-document.v1";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function scriptLiteral(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export function compileHtmlDocument({ ir, hom }) {
  if (ir?.ir !== "HNK-IR" || ir?.version !== "0.1.0" || !ir?.world) {
    throw new Error("HAKODAN_HTML_TARGET_INVALID_IR");
  }
  if (hom?.model !== "HOM" || hom?.version !== "0.1.0" || !Array.isArray(hom.objects)) {
    throw new Error("HAKODAN_HTML_TARGET_INVALID_HOM");
  }

  const unsupported = ir.world.events.flatMap(event =>
    event.actions.filter(action => action.name !== "mostrar")
      .map(action => `${event.name}:${action.name}`)
  );
  if (unsupported.length) {
    throw new Error(`HAKODAN_HTML_TARGET_UNSUPPORTED_ACTION: ${unsupported.join(",")}`);
  }

  const entities = ir.world.entities.map(entity => {
    const properties = Object.entries(entity.properties)
      .map(([name, value]) => `<li data-property="${escapeHtml(name)}"><strong>${escapeHtml(name)}</strong>: <span>${escapeHtml(value)}</span></li>`)
      .join("");
    return `<article class="entity" data-entity="${escapeHtml(entity.name)}"><h2>${escapeHtml(entity.name)}</h2><ul>${properties}</ul></article>`;
  }).join("");

  const actions = ir.world.events.flatMap(event => event.actions.map(action => ({ event: event.name, ...action })));
  const runtimeActions = scriptLiteral(actions);

  return `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${escapeHtml(ir.world.name)} — haKodan</title>\n<style>body{font-family:system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 20px}main{display:grid;gap:16px}.entity,#manifestation{border:1px solid currentColor;border-radius:12px;padding:16px}ul{padding-left:20px}</style>\n</head>\n<body data-hakodan-target="${TARGET_ID}">\n<header><small>haKodan · ${TARGET_ID}</small><h1>${escapeHtml(ir.world.name)}</h1></header>\n<main>${entities}<section id="manifestation" aria-live="polite"></section></main>\n<script>\nconst actions=${runtimeActions};\nconst output=document.getElementById("manifestation");\nfor(const action of actions){if(action.name==="mostrar"){const p=document.createElement("p");p.dataset.event=action.event;p.textContent=String(action.arguments[0]??"");output.appendChild(p);}}\n</script>\n</body>\n</html>\n`;
}

export { TARGET_ID as HAKODAN_HTML_DOCUMENT_TARGET_ID };
