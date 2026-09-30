import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTargetRegistry,
  registerTargetCapability,
  resolveTargetCapability,
} from '../src/target-capability-registry.mjs';

test('M7 registry starts empty and refuses unknown manifestation combinations', () => {
  const registry = createTargetRegistry();
  const result = resolveTargetCapability(registry, {
    target: 'web', format: 'html', adapter: 'hakodan:web', artifact: 'index.html'
  });
  assert.equal(result.status, 'UNSUPPORTED');
});

test('M7 supports only explicitly registered target/format/adapter combinations', () => {
  let registry = createTargetRegistry();
  registry = registerTargetCapability(registry, {
    target: 'web',
    format: 'html',
    adapter: 'hakodan:web',
    artifactPattern: '*.html',
    authority: 'HAKODAN',
  });

  const supported = resolveTargetCapability(registry, {
    target: 'web', format: 'html', adapter: 'hakodan:web', artifact: 'index.html'
  });
  assert.equal(supported.status, 'SUPPORTED');
  assert.equal(supported.capability.authority, 'HAKODAN');

  const wrongAdapter = resolveTargetCapability(registry, {
    target: 'web', format: 'html', adapter: 'goodle:web', artifact: 'index.html'
  });
  assert.equal(wrongAdapter.status, 'UNSUPPORTED');
});

test('M7 does not promote target adapters into semantic authority', () => {
  let registry = createTargetRegistry();
  registry = registerTargetCapability(registry, {
    target: 'phaser', format: 'js', adapter: 'hakodan:phaser', artifactPattern: '*.js', authority: 'HAKODAN'
  });
  const result = resolveTargetCapability(registry, {
    target: 'phaser', format: 'js', adapter: 'hakodan:phaser', artifact: 'game.js'
  });
  assert.notEqual(result.capability.authority, 'TARGET');
  assert.notEqual(result.capability.authority, 'GOODLE');
});
