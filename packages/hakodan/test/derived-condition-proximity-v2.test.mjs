import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFormula } from "../src/derived-formula-state.mjs";

const values={alakazamX:0,alakazamY:0,portalX:3,portalY:4,threshold:5};
const context={resolveStat:stat=>values[stat]};
const proximity={
 op:"IF",
 condition:{
  op:"LTE",
  left:{op:"DISTANCE",args:[{stat:"alakazamX"},{stat:"alakazamY"},{stat:"portalX"},{stat:"portalY"}]},
  right:{stat:"threshold"}
 },
 then:{value:1},
 else:{value:0}
};

test("V2-29 proximity composes DISTANCE directly inside a condition",()=>{
 const result=evaluateFormula(proximity,context);
 assert.equal(result.value,1);
 assert.equal(result.condition.left.value,5);
 assert.equal(result.condition.right.value,5);
 assert.equal(result.condition.result,true);
 assert.equal(result.selected,"then");
});

test("V2-29 proximity selects closed state outside threshold",()=>{
 const result=evaluateFormula(proximity,{resolveStat:stat=>stat==="threshold"?4:values[stat]});
 assert.equal(result.value,0);
 assert.equal(result.condition.result,false);
 assert.equal(result.selected,"else");
});
