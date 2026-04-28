---
name: limits-to-growth
display-name: "Limits to Growth"
description: "Growth driven by a reinforcing loop slows and then halts as a hidden constraint kicks in"
layer: 1
model: cld
type: archetype
status: stub
---

# Limits to Growth

## Signature

A reinforcing loop drives growth — more activity, more resources, more activity. At some point a balancing loop activates: a constraint, a saturation, a backlash. Growth slows, then plateaus, then can collapse if the constraint tightens further. The growth engine is still running; it is just no longer dominant.

## Generic structure

```cld
variables:
  - growing-action
  - performance
  - constraint
  - slowing-action

links:
  growing-action  → performance     [+]
  performance     → growing-action  [+]
  performance     → constraint      [+]
  constraint      → slowing-action  [+]
  slowing-action  → performance     [-]

loops:
  R1 [reinforcing]: growing-action → performance → growing-action
  B1 [balancing]:   performance → constraint → slowing-action → performance
```

## Slots

| Slot | What goes here |
|---|---|
| `growing-action` | The activity or investment driving growth |
| `performance` | The growing measure (revenue, users, output…) |
| `constraint` | The hidden limit (capacity, quality, market saturation, fatigue) |
| `slowing-action` | What the constraint produces that dampens performance |

## Recognition triggers

- "it used to work, now it's plateauing"
- "we hit a ceiling"
- "diminishing returns"
- "the playbook stopped working"

## Classic example

A startup grows by referrals. Early users love the product and tell friends. Growth compounds — until product-market fit erodes for the broader audience the early users are referring. New users churn. Word-of-mouth quality drops. The R-loop is still there but the B-loop now dominates.

## Sources

Senge, *The Fifth Discipline*, archetype #2. Originally Donella Meadows / Forrester.
