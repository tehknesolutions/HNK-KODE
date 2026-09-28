export function scoreRecognition(response, expectedResponse) {
  return Object.freeze({
    recognitionCorrect: response === expectedResponse ? 1 : 0,
  });
}

export function scoreProduction(expected, response) {
  const expectedKeys = Object.keys(expected);
  const responseKeys = Object.keys(response);
  const sameSchema = expectedKeys.length === responseKeys.length
    && expectedKeys.every((key) => responseKeys.includes(key));

  if (!sameSchema) {
    throw new Error('Production requires matching structural schemas');
  }

  const structuralMatched = expectedKeys.reduce(
    (count, key) => count + (expected[key] === response[key] ? 1 : 0),
    0,
  );

  return Object.freeze({
    productionExact: structuralMatched === expectedKeys.length ? 1 : 0,
    structuralMatched,
    structuralTotal: expectedKeys.length,
  });
}
