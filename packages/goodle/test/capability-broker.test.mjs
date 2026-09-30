import test from "node:test";
import assert from "node:assert/strict";
import { requestCapability, grantCapability } from "../src/capability-broker.mjs";

test("M4 capability broker fails closed by default", () => {
  const request = requestCapability({ sessionId: "s1", capability: "network.fetch" });
  assert.equal(request.status, "REQUESTED");
  assert.equal(request.granted, false);
});

test("M4 grant requires explicit authority and scope", () => {
  const request = requestCapability({ sessionId: "s1", capability: "artifact.write" });
  const grant = grantCapability(request, { authority: "creator", scope: ["project:p1"] });
  assert.equal(grant.status, "GRANTED");
  assert.equal(grant.granted, true);
  assert.deepEqual(grant.scope, ["project:p1"]);
});

test("M4 refuses implicit grants", () => {
  const request = requestCapability({ sessionId: "s1", capability: "artifact.write" });
  assert.throws(() => grantCapability(request, {}), /GOODLE_CAPABILITY_EXPLICIT_GRANT_REQUIRED/);
});
