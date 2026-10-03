import test from "node:test";
import assert from "node:assert/strict";
import {
  WEB_TARGET_V1,
  getWebTargetCapability,
  assertWebTargetSupported
} from "../src/targets/web-target-v1.mjs";

test("web is the single V1 visible target", () => {
  assert.equal(WEB_TARGET_V1.id, "web");
  assert.equal(WEB_TARGET_V1.status, "SUPPORTED");
  assert.equal(getWebTargetCapability().id, "web");
  assert.equal(assertWebTargetSupported("web").id, "web");
});

test("unknown targets fail closed", () => {
  assert.throws(
    () => assertWebTargetSupported("native"),
    /HAKODAN_TARGET_UNSUPPORTED/
  );
});