# M36 Registry Execution Safety

The registry does not call manifestation dispatch, runtime adapters, execution-evidence providers, or capability brokers. It stores copied metadata from an already verified M35 import.

Consequently `REGISTERED` is not execution evidence and must never be used as a substitute for the execution-evidence pipeline.
