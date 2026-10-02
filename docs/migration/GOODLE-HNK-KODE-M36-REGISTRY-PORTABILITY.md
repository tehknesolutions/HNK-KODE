# M36 Registry Portability Semantics

The registry consumes the portable M35 import result rather than reaching back into M33/M34 internals. This keeps the catalog boundary downstream of conformance verification and allows later storage adapters to be designed separately without changing the meaning of the verified evidence record.
