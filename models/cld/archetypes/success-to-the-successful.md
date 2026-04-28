---
name: success-to-the-successful
display-name: "Success to the Successful"
description: "When two activities compete for a shared resource, early advantage to one diverts more resource to it, starving the other"
layer: 1
model: cld
type: archetype
status: stub
---

# Success to the Successful

## Signature

Two options compete for a finite resource (attention, budget, time, talent). Whichever performs better early gets more of the resource — which makes it perform even better — which gets it more resource. The other option starves not because it is worse, but because it never got the chance to prove otherwise. The outcome looks like merit; the mechanism is path-dependence.

## Generic structure

```cld
variables:
  - a-success
  - b-success
  - resource-to-a
  - resource-to-b

links:
  a-success     → resource-to-a [+]
  resource-to-a → a-success     [+]
  a-success     → resource-to-b [-]
  b-success     → resource-to-b [+]
  resource-to-b → b-success     [+]
  b-success     → resource-to-a [-]

loops:
  R1 [reinforcing]: a-success → resource-to-a → a-success
  R2 [reinforcing]: b-success → resource-to-b → b-success
```

(The two R-loops are coupled by the shared finite resource — gain to one is loss to the other.)

## Slots

| Slot | What goes here |
|---|---|
| `a-success` / `b-success` | The performance of each option |
| `resource-to-a` / `resource-to-b` | Allocation of the shared resource |

## Recognition triggers

- "the rich get richer"
- "Matthew effect"
- "winner takes all"
- "we never gave the other option a fair chance"

## Classic example

A manager has two direct reports. One delivers a quick win and gets the next interesting project. They build skills, deliver again, get more projects. The other does adequate work on duller assignments. Five years later, one is a senior leader and the other left.

## Sources

Senge, *The Fifth Discipline*, archetype #7.
