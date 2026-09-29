# VHK/haKodan Chat Prototype Status v1.0–v1.7

**Status:** ARCHIVE / NON-AUTHORITATIVE IMPLEMENTATION NOTES

Chat-generated ZIPs explored:
- parser;
- semantic registry;
- type checker/serializer;
- HOM compiler;
- HNK-IR compiler;
- target adapters;
- capability registry;
- manifestation planner.

They are preserved as design evidence but were not a single integrated tested package.

Known cross-version issues discovered during review included:
1. early parser could not parse some bare-list syntax used by its own sample;
2. type-checker port IDs and attribute aliases could disagree;
3. HOM operation extraction could emit CREATE_AGENT while IR expected CREATE;
4. provenance metadata was incomplete in an early IR compiler;
5. early web adapter was a minimal serialization prototype;
6. planned adapters were not implementations;
7. TypeScript compilation was not proven for the whole ZIP sequence.

Maintained repository code/specifications supersede these prototypes. Any useful module must be migrated explicitly with tests rather than copied blindly.
