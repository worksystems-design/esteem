---
name: tragedy-of-the-commons
display-name: "Tragedy of the Commons"
description: "Many actors each rationally use a shared resource, and their aggregate use degrades or destroys it"
layer: 1
model: cld
type: archetype
status: stub
---

# Tragedy of the Commons

## Signature

A resource is shared and finite. Each actor's marginal use yields private benefit. The cost of degrading the resource is borne by all. Each actor is locally rational to use more. In aggregate, the resource is overused, depleted, or destroyed. Every actor loses, but no single actor's restraint changes the outcome.

## Generic structure

```cld
variables:
  - a-activity
  - b-activity
  - total-activity
  - resource-condition
  - gain-per-activity

links:
  a-activity         → total-activity     [+]
  b-activity         → total-activity     [+]
  total-activity     → resource-condition [-, delay:high]
  resource-condition → gain-per-activity  [+]
  gain-per-activity  → a-activity         [+]
  gain-per-activity  → b-activity         [+]

loops:
  R1 [reinforcing]: a-activity → total-activity → resource-condition → gain-per-activity → a-activity
  R2 [reinforcing]: b-activity → total-activity → resource-condition → gain-per-activity → b-activity
```

(Both R-loops drive each actor's activity until the shared resource collapses.)

## Slots

| Slot | What goes here |
|---|---|
| `a-activity`, `b-activity`, … | Each actor's use of the resource |
| `total-activity` | Aggregate use |
| `resource-condition` | Health of the shared resource |
| `gain-per-activity` | Marginal benefit each actor gets per unit of activity |

## Recognition triggers

- "everyone is doing it"
- "the shared pool is exhausted"
- "no one's responsible for the whole"
- "individually rational, collectively destructive"

## Classic example

A team's senior engineers are a shared resource. Every project pulls them in for review. Each project's pull is justified. In aggregate, the seniors are interrupted constantly and produce no deep work themselves. Eventually they burn out or leave.

## Sources

Garrett Hardin, "The Tragedy of the Commons" (*Science*, 1968). Senge, *The Fifth Discipline*, archetype #8.
