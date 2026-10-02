const TARGET_ID = "hakodan.target.html-document.v2";

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function scriptLiteral(value) { return JSON.stringify(value).replaceAll("<", "\\u003c"); }

export function compileHtmlDocument({ ir, hom, startupEvent = "iniciar" }) {
  if (ir?.ir !== "HNK-IR" || !["0.1.0", "0.2.0"].includes(ir?.version) || !ir?.world) throw new Error("HAKODAN_HTML_TARGET_INVALID_IR");
  if (hom?.model !== "HOM" || !["0.1.0", "0.2.0"].includes(hom?.version) || !Array.isArray(hom.objects)) throw new Error("HAKODAN_HTML_TARGET_INVALID_HOM");

  const unsupported = ir.world.events.flatMap(event => event.actions.filter(action => action.name !== "mostrar" || action.arguments?.length !== 1).map(action => `${event.name}:${action.name}/${action.arguments?.length ?? 0}`));
  if (unsupported.length) throw new Error(`HAKODAN_HTML_TARGET_UNSUPPORTED_ACTION: ${unsupported.join(",")}`);

  const entities = ir.world.entities.map(entity => {
    const properties = Object.entries(entity.properties).map(([name, value]) => `<li data-property="${escapeHtml(name)}"><strong>${escapeHtml(name)}</strong>: <span>${escapeHtml(value)}</span></li>`).join("");
    const open = entity.properties.open === undefined ? "" : ` data-state-open="${escapeHtml(entity.properties.open)}"`;
    return `<article class="entity" data-entity="${escapeHtml(entity.name)}"${open}><h2>${escapeHtml(entity.name)}</h2><div class="avatar">${escapeHtml(entity.name === "Portal" ? "◫" : "◆")}</div><ul>${properties}</ul></article>`;
  }).join("");

  const runtime = scriptLiteral({ entities: ir.world.entities, rules: ir.world.rules ?? [], events: Object.fromEntries(ir.world.events.map(event => [event.name, event.actions])) });
  const runtimeStartupEvent = scriptLiteral(startupEvent);

  return `<!doctype html>\n<html lang="pt-BR">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(ir.world.name)} — haKodan</title><style>body{font-family:system-ui,sans-serif;max-width:860px;margin:32px auto;padding:0 20px;background:#111;color:#eee}main{display:grid;grid-template-columns:1fr 1fr;gap:16px}.entity,#manifestation{border:1px solid #777;border-radius:14px;padding:16px}.avatar{font-size:56px}.entity[data-state-open="true"]{outline:4px solid #eee}.entity[data-state-open="true"] .avatar{transform:scaleX(1.8)}button{padding:12px 18px;margin:16px 0}</style></head>\n<body data-hakodan-target="${TARGET_ID}"><header><small>haKodan · ${TARGET_ID}</small><h1>${escapeHtml(ir.world.name)}</h1><button data-control="approach">Aproximar Alakazam do Portal</button></header><main>${entities}<section id="manifestation" aria-live="polite"></section></main>\n<script>\nconst model=${runtime};\nconst state=new Map(model.entities.map(e=>[e.id,{id:e.id,name:e.name,...e.properties,position:{x:Number(e.properties.x??0),y:Number(e.properties.y??0)}}]));\nconst output=document.getElementById("manifestation");\nfunction evaluateCondition(c){if(c.kind!=="NEAR")throw new Error("HAKODAN_RUNTIME_UNSUPPORTED_CONDITION:"+c.kind);const a=state.get(c.subject).position,b=state.get(c.target).position;return Math.hypot(a.x-b.x,a.y-b.y)<=c.threshold;}\nfunction renderEntity(entity){const el=document.querySelector('[data-entity="'+entity.name+'"]');if(!el)return;if(Object.hasOwn(entity,"open"))el.dataset.stateOpen=String(entity.open);}\nfunction applyAction(a){if(a.kind!=="SET")throw new Error("HAKODAN_RUNTIME_UNSUPPORTED_ACTION:"+a.kind);const entity=state.get(a.subject);if(Object.is(entity[a.path],a.value))return;entity[a.path]=a.value;renderEntity(entity);const p=document.createElement("p");p.textContent=entity.name+"."+a.path+" → "+String(a.value);output.appendChild(p);}\nfunction step(){for(const rule of model.rules){if(rule.trigger!=="tick")throw new Error("HAKODAN_RUNTIME_UNSUPPORTED_TRIGGER:"+rule.trigger);if(evaluateCondition(rule.condition))for(const action of rule.actions)applyAction(action);}}\nfunction dispatch(eventName){for(const action of model.events[eventName]??[]){if(action.name==="mostrar"){const p=document.createElement("p");p.textContent=String(action.arguments[0]);output.appendChild(p);}}}\ndocument.querySelector('[data-control="approach"]').addEventListener("click",()=>{const alakazam=[...state.values()].find(e=>e.name==="Alakazam");const portal=[...state.values()].find(e=>e.name==="Portal");alakazam.position={x:portal.position.x-2,y:portal.position.y};step();});\ndispatch(${runtimeStartupEvent});\n</script></body></html>\n`;
}

export { TARGET_ID as HAKODAN_HTML_DOCUMENT_TARGET_ID };
