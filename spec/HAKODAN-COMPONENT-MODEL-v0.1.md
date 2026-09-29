# haKodan Component Model v0.1

**Status:** executable baseline  
**Data:** 2026-09-29

## Purpose

Components add capabilities to HOM objects without forcing inheritance.

## Contract

A component definition contains:

```text
id
name
version
properties
events
behaviors
requires
```

An attachment contains:

```text
componentId
version
state
```

## Rules

- component IDs are stable semantic IDs;
- duplicate attachment is rejected;
- required component dependencies must already be present;
- component state is validated against declared property types;
- components do not redefine object identity;
- HNK-KODE surface syntax for component declarations will be added only after semantic contracts are stable.
