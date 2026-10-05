const BINARY_OPS=new Set(["ADD","SUBTRACT","MULTIPLY","DIVIDE","MIN","MAX"]);
const UNARY_OPS=new Set(["ABS","ROUND","FLOOR","CEIL"]);
const TERNARY_OPS=new Set(["CLAMP","NORMALIZE"]);
const OPS=new Set([...BINARY_OPS,...UNARY_OPS,...TERNARY_OPS]);
const CONDITION_OPS=new Set(["GT","GTE","LT","LTE","EQ"]);
const VALUE_KEYS=new Set(["value"]),STAT_KEYS=new Set(["stat"]),OP_KEYS=new Set(["op","args"]),IF_KEYS=new Set(["op","condition","then","else"]),CONDITION_KEYS=new Set(["op","left","right"]);
function clone(v){return structuredClone(v);}
function numeric(v){if(typeof v!=="number"||!Number.isFinite(v))throw new Error("HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED");return v;}
function assertContext(c){if(!c||typeof c!=="object"||typeof c.resolveStat!=="function")throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");}
function exactKeys(o,a){const k=Object.keys(o);return k.length===a.size&&k.every(x=>a.has(x));}
function evaluateCondition(c,context){
 if(!c||typeof c!=="object"||Array.isArray(c)||!exactKeys(c,CONDITION_KEYS)||typeof c.op!=="string")throw new Error("HAKODAN_DERIVED_CONDITION_INVALID");
 if(!CONDITION_OPS.has(c.op))throw new Error(`HAKODAN_DERIVED_CONDITION_UNSUPPORTED_OP: ${c.op}`);
 const left=evaluate(c.left,context),right=evaluate(c.right,context);let result;
 switch(c.op){case"GT":result=left.value>right.value;break;case"GTE":result=left.value>=right.value;break;case"LT":result=left.value<right.value;break;case"LTE":result=left.value<=right.value;break;case"EQ":result=left.value===right.value;break;}
 return {expression:{op:c.op,left:left.expression,right:right.expression},left,right,result};
}
function evaluate(expression,context){
 if(!expression||typeof expression!=="object"||Array.isArray(expression))throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 const hasValue=Object.prototype.hasOwnProperty.call(expression,"value"),hasStat=Object.prototype.hasOwnProperty.call(expression,"stat"),hasOp=Object.prototype.hasOwnProperty.call(expression,"op");
 if(Number(hasValue)+Number(hasStat)+Number(hasOp)!==1)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 if(hasValue){if(!exactKeys(expression,VALUE_KEYS))throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");return{value:numeric(expression.value),expression:clone(expression)};}
 if(hasStat){if(!exactKeys(expression,STAT_KEYS)||typeof expression.stat!=="string"||!expression.stat)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");return{value:numeric(context.resolveStat(expression.stat)),expression:clone(expression)};}
 if(expression.op==="IF"){
  if(!exactKeys(expression,IF_KEYS))throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  const condition=evaluateCondition(expression.condition,context),selected=condition.result?"then":"else";
  const branch=evaluate(expression[selected],context);
  return{value:numeric(branch.value),expression:{op:"IF",condition:condition.expression,[selected]:branch.expression},condition,selected,branch};
 }
 if(!exactKeys(expression,OP_KEYS)||typeof expression.op!=="string"||!expression.op)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 if(!OPS.has(expression.op))throw new Error(`HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: ${expression.op}`);
 if(!Array.isArray(expression.args))throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 if(UNARY_OPS.has(expression.op)&&expression.args.length!==1)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 if(BINARY_OPS.has(expression.op)&&expression.args.length<2)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 if(TERNARY_OPS.has(expression.op)&&expression.args.length!==3)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
 const operands=expression.args.map(a=>evaluate(a,context));let value;
 switch(expression.op){case"ADD":value=operands.reduce((r,o)=>r+o.value,0);break;case"SUBTRACT":value=operands.slice(1).reduce((r,o)=>r-o.value,operands[0].value);break;case"MULTIPLY":value=operands.reduce((r,o)=>r*o.value,1);break;case"DIVIDE":value=operands[0].value;for(const o of operands.slice(1)){if(o.value===0)throw new Error("HAKODAN_DERIVED_FORMULA_DIVIDE_BY_ZERO");value/=o.value;}break;case"MIN":value=Math.min(...operands.map(o=>o.value));break;case"MAX":value=Math.max(...operands.map(o=>o.value));break;case"ABS":value=Math.abs(operands[0].value);break;case"ROUND":value=Math.round(operands[0].value);break;case"FLOOR":value=Math.floor(operands[0].value);break;case"CEIL":value=Math.ceil(operands[0].value);break;case"CLAMP":if(operands[1].value>operands[2].value)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID_RANGE");value=Math.min(Math.max(operands[0].value,operands[1].value),operands[2].value);break;case"NORMALIZE":{if(operands[1].value>=operands[2].value)throw new Error("HAKODAN_DERIVED_FORMULA_INVALID_RANGE");const bounded=Math.min(Math.max(operands[0].value,operands[1].value),operands[2].value);value=(bounded-operands[1].value)/(operands[2].value-operands[1].value);break;}}
 return{value:numeric(value),expression:{op:expression.op,args:operands.map(o=>o.expression)},operands};
}
export function evaluateFormula(expression,context){assertContext(context);return evaluate(expression,context);}
