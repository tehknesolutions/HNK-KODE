import test from 'node:test';
import assert from 'node:assert/strict';
import { lowerAstToIr, materializeRuntime } from '../src/mhcm-runtime-v0.mjs';

const ast = {
  type: 'world',
  name: 'genesis',
  entities: [{
    name: 'light',
    properties: [{ name: 'active', value: false }],
    events: [{ name: 'awaken', actions: [{ name: 'activate', args: [] }] }]
  }]
};

test('lowers KODESCRIPT AST V0 to deterministic HNK-IR V0', () => {
  assert.deepEqual(lowerAstToIr(ast, ['fixture:genesis']), {
    version: '0.1',
    world: 'genesis',
    instructions: [
      { op: 'ENTITY_DECLARE', target: 'light' },
      { op: 'PROPERTY_SET', target: 'light', key: 'active', value: false },
      { op: 'EVENT_DECLARE', target: 'light.awaken' },
      { op: 'ACTION_CALL', target: 'light.activate', args: [] }
    ],
    provenance: ['fixture:genesis']
  });
});

test('materializes HNK-IR V0 into deterministic runtime world', () => {
  const runtime = materializeRuntime(lowerAstToIr(ast, ['fixture:genesis']));
  assert.deepEqual(runtime, {
    world: 'genesis',
    entities: {
      light: {
        properties: { active: false },
        events: ['awaken'],
        actionsCalled: ['activate']
      }
    }
  });
});
