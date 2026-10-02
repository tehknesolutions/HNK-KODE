import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeProvenanceImpact } from '../src/evidence-provenance-impact.mjs';

const left=[{id:'a',parents:[]},{id:'b',parents:['a']},{id:'c',parents:['b']}];
const right=[{id:'a',parents:[]},{id:'b',parents:[]},{id:'c',parents:['b']}];
const diff={direct:{added:[],removed:['a'],orderingChanged:false},ancestors:{added:[],removed:['a']}};

test('M28.1 identifies changed sources',()=>{const r=analyzeProvenanceImpact(left,right,diff);assert.equal(r.status,'ANALYZED');assert.deepEqual(r.impact.changedSources,['a']);});
test('M28.3 identifies direct affected children',()=>{const r=analyzeProvenanceImpact(left,right,diff);assert.deepEqual(r.impact.directChildren,['b']);});
test('M28.4 identifies transitive descendants',()=>{const r=analyzeProvenanceImpact(left,right,diff);assert.deepEqual(r.impact.transitiveDescendants,['b','c']);});
test('M28.5 preserves ordering impact',()=>{const r=analyzeProvenanceImpact(left,right,{...diff,direct:{...diff.direct,orderingChanged:true}});assert.equal(r.impact.orderingChanged,true);});
test('M28 rejects invalid input',()=>{const r=analyzeProvenanceImpact(left,right,{});assert.equal(r.status,'REJECTED');});