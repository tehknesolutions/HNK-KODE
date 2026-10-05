const OPS = new Set(["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "MIN", "MAX"]);
const VALUE_KEYS = new Set(["value"]);
const STAT_KEYS = new Set(["stat"]);
const OP_KEYS = new Set(["op", "args"]);

function clone(value) { return structuredClone(value); }
function numeric(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED");
  return value;
}
function assertContext(context) {
  if (!context || typeof context !== "object" || typeof context.resolveStat !== "function") throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
}
function exactKeys(expression, allowed) {
  const keys = Object.keys(expression);
  return keys.length === allowed.size && keys.every(key => allowed.has(key));
}
function evaluate(expression, context) {
  if (!expression || typeof expression !== "object" || Array.isArray(expression)) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  const hasValue=Object.prototype.hasOwnProperty.call(expression,"value"),hasStat=Object.prototype.hasOwnProperty.call(expression,"stat"),hasOp=Object.prototype.hasOwnProperty.call(expression,"op");
  if (Number(hasValue)+Number(hasStat)+Number(hasOp)!==1) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  if (hasValue) {
    if (!exactKeys(expression, VALUE_KEYS)) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
    return {value:numeric(expression.value),expression:clone(expression)};
  }
  if (hasStat) {
    if (!exactKeys(expression, STAT_KEYS) || typeof expression.stat!=="string" || !expression.stat) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
    return {value:numeric(context.resolveStat(expression.stat)),expression:clone(expression)};
  }
  if (!exactKeys(expression, OP_KEYS) || typeof expression.op!=="string" || !expression.op) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  if (!OPS.has(expression.op)) throw new Error(`HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: ${expression.op}`);
  if (!Array.isArray(expression.args) || expression.args.length<2) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  const operands=expression.args.map(arg=>evaluate(arg,context));
  let value;
  switch(expression.op){
    case "ADD": value=operands.reduce((r,o)=>r+o.value,0); break;
    case "SUBTRACT": value=operands.slice(1).reduce((r,o)=>r-o.value,operands[0].value); break;
    case "MULTIPLY": value=operands.reduce((r,o)=>r*o.value,1); break;
    case "DIVIDE":
      value=operands[0].value;
      for(const operand of operands.slice(1)){if(operand.value===0)throw new Error("HAKODAN_DERIVED_FORMULA_DIVIDE_BY_ZERO");value/=operand.value;}
      break;
    case "MIN": value=Math.min(...operands.map(o=>o.value)); break;
    case "MAX": value=Math.max(...operands.map(o=>o.value)); break;
  }
  return {value:numeric(value),expression:clone(expression),operands};
}
export function evaluateFormula(expression,context){assertContext(context);return evaluate(expression,context);}
