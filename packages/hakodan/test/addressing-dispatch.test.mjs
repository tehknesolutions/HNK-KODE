import test from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/parser.mjs";
import { toHom } from "../src/hom.mjs";
import { defineComponent, attachComponent } from "../src/component-model.mjs";
import { TYPE_IDS } from "../src/type-system.mjs";
import { objectAddress, propertyAddress, componentAddress, buildAddressTable, resolveAddress } from "../src/addressing.mjs";
import { planDispatch } from "../src/event-dispatch.mjs";

function makeHom(profile) {
  const source = profile === "PT-BR"
    ? 'mundo W { entidade E { propriedade vida = 100 } evento Start { ação run("E") ação log("E") } }'
    : 'world W { entity E { property vida = 100 } event Start { action run("E") action log("E") } }';
  return toHom(parse(source,{profile}));
}

test("endereçamento de objeto/propriedade é estável entre profiles",()=>{
  const a=makeHom("PT-BR");
  const b=makeHom("EN");
  const ea=a.objects.find(x=>x.type==="Entity");
  const eb=b.objects.find(x=>x.type==="Entity");
  assert.equal(objectAddress(ea),objectAddress(eb));
  assert.equal(propertyAddress(ea,"vida"),propertyAddress(eb,"vida"));
});

test("component address é namespaced pelo objeto",()=>{
  const hom=makeHom("PT-BR");
  const entity=hom.objects.find(x=>x.type==="Entity");
  const def=defineComponent({id:"hnk.component.Health",properties:{current:TYPE_IDS.NUMBER}});
  attachComponent(entity,def,{current:100});
  assert.equal(componentAddress(entity,"hnk.component.Health"),"hnk://world/W/entity/E/component/hnk.component.Health");
});

test("Address Table é determinística e resolve fail-closed",()=>{
  const hom=makeHom("PT-BR");
  const table=buildAddressTable(hom);
  const entry=resolveAddress(table,"hnk://world/W/entity/E/property/vida");
  assert.equal(entry.kind,"Property");
  assert.throws(()=>resolveAddress(table,"hnk://missing"),/ADDRESS_NOT_FOUND/);
});

test("dispatch plan preserva ordem canônica",()=>{
  const hom=makeHom("PT-BR");
  const plan=planDispatch(hom,"hnk://world/W/event/Start");
  assert.deepEqual(plan.steps.map(x=>x.name),["run","log"]);
  assert.deepEqual(plan.steps.map(x=>x.order),[0,1]);
});

test("PT-BR e EN produzem dispatch plan semanticamente idêntico",()=>{
  const a=planDispatch(makeHom("PT-BR"),"hnk://world/W/event/Start");
  const b=planDispatch(makeHom("EN"),"hnk://world/W/event/Start");
  const strip=p=>({...p,steps:p.steps.map(s=>({...s}))});
  assert.deepEqual(strip(a),strip(b));
});

test("evento desconhecido falha fechado",()=>{
  assert.throws(()=>planDispatch(makeHom("PT-BR"),"hnk://world/W/event/Missing"),/EVENT_NOT_FOUND/);
});
