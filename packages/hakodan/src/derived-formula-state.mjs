const OPS = new Set(["ADD", "SUBTRACT"]);

function clone(value) {
  return structuredClone(value);
}

function numeric(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("HAKODAN_DERIVED_FORMULA_NUMERIC_REQUIRED");
  }
  return value;
}

function assertContext(context) {
  if (!context || typeof context !== "object" || typeof context.resolveStat !== "function") {
    throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  }
}

function evaluate(expression, context) {
  if (!expression || typeof expression !== "object" || Array.isArray(expression)) {
    throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  }

  const hasValue = Object.prototype.hasOwnProperty.call(expression, "value");
  const hasStat = Object.prototype.hasOwnProperty.call(expression, "stat");
  const hasOp = Object.prototype.hasOwnProperty.call(expression, "op");
  const shapes = Number(hasValue) + Number(hasStat) + Number(hasOp);
  if (shapes !== 1) throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");

  if (hasValue) {
    const value = numeric(expression.value);
    return { value, expression: clone(expression) };
  }

  if (hasStat) {
    if (typeof expression.stat !== "string" || !expression.stat) {
      throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
    }
    const value = numeric(context.resolveStat(expression.stat));
    return { value, expression: clone(expression) };
  }

  if (typeof expression.op !== "string" || !expression.op) {
    throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  }
  if (!OPS.has(expression.op)) {
    throw new Error(`HAKODAN_DERIVED_FORMULA_UNSUPPORTED_OP: ${expression.op}`);
  }
  if (!Array.isArray(expression.args) || expression.args.length < 2) {
    throw new Error("HAKODAN_DERIVED_FORMULA_INVALID");
  }

  const operands = expression.args.map(arg => evaluate(arg, context));
  let value;
  if (expression.op === "ADD") {
    value = operands.reduce((sum, operand) => sum + operand.value, 0);
  } else {
    value = operands.slice(1).reduce((result, operand) => result - operand.value, operands[0].value);
  }

  return {
    value: numeric(value),
    expression: clone(expression),
    operands
  };
}

export function evaluateFormula(expression, context) {
  assertContext(context);
  return evaluate(expression, context);
}
