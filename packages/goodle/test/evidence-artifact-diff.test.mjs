import test from 'node:test';
import assert from 'node:assert/strict';
import { compareAuditArtifacts } from '../src/evidence-artifact-diff.mjs';

const a={records:[{semanticId:'m21',target:'hakodan-manifestation',adapter:'manifestation-bridge-v1',artifact:'plan.json',capabilityId:'cap-21',authority:'HAKODAN',state:'DISPATCH_ACCEPTED'}]};
const b={records:[{...a.records[0],state:'OBSERVED_EXECUTION',observationId:'obs-21',observedAt:'2026-10-02T14:40:00Z',evidenceSource:'hakodan-runtime'}]};

test('M21.1 reports changed records deterministically',()=>{const r=compareAuditArtifacts(a,b);assert.equal(r.status,'COMPARED');assert.equal(r.diff.changed.length,1);});
test('M21.3 reports additions and removals',()=>{const extra={...b,records:[...b.records,{...b.records[0],observationId:'obs-21b'}]};const r=compareAuditArtifacts(b,extra);assert.equal(r.diff.added.length,1);assert.equal(r.diff.removed.length,0);});
test('M21.4 reports ordering changes explicitly',()=>{const x={records:[{...a.records[0],observationId:'a'},{...a.records[0],observationId:'b'}]};const y={records:[x.records[1],x.records[0]]};const r=compareAuditArtifacts(x,y);assert.equal(r.status,'COMPARED');assert.equal(r.diff.orderingChanged,true);});
test('M21.4 rejects different lineage',()=>{const y={records:[{...a.records[0],semanticId:'different'}]};const r=compareAuditArtifacts(a,y);assert.equal(r.status,'REJECTED');});
test('M21.5 diff snapshots are immutable',()=>{const r=compareAuditArtifacts(a,b);assert.ok(Object.isFrozen(r.diff));assert.ok(Object.isFrozen(r.diff.changed));});