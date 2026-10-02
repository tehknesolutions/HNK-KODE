export const WEB_TARGET_V1 = Object.freeze({
  id: "web",
  version: "1.0.0",
  status: "SUPPORTED",
  artifact: "text/html",
  visible: true
});

export function getWebTargetCapability() {
  return WEB_TARGET_V1;
}

export function assertWebTargetSupported(target) {
  if (target !== WEB_TARGET_V1.id) {
    throw new Error(`HAKODAN_TARGET_UNSUPPORTED:${target}`);
  }
  return WEB_TARGET_V1;
}