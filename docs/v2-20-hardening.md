# V2-20 post-review hardening

Follow-up to PR #230. The independent review found that inventory and equipment ownership paths could overlap structurally. The follow-up rejects equal/ancestor/descendant ownership paths before mutation and adds regressions for equip and unequip.
