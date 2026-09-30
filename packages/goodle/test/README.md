# @hnk/goodle verification

The Goodle migration tests are intentionally independent from Gate 03 Authority Independence.

Recommended executable command when a runner is available:

```sh
node --test packages/goodle/test/*.test.mjs
```

Current migration policy:

- implementation commits may exist with `VERIFICATION PENDING`;
- no test suite is reported as passing without a fresh execution result;
- Gate 03 source-lock failures are not attributed to Goodle tests unless logs show that relationship;
- registry conformance distinguishes executable haKodan tokens from IDs that exist only in the bootstrap specification.
