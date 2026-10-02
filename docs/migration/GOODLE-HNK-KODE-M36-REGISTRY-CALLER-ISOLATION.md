# Registry Caller Isolation

Registration copies the preserved bundle fields and separately copies/freezes the stages map. Later mutation of the caller's source object therefore cannot rewrite the stored registry record through shared references.
