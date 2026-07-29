---
name: eroding-goals
display-name: "Eroding Goals"
description: "A persistent gap between goal and reality is closed by quietly lowering the goal rather than improving the reality"
layer: 1
model: cld
type: archetype
status: stub
---

# Eroding Goals

## Signature

Reality falls short of a goal. The gap creates pressure. There are two responses: improve the reality, or lower the goal. Lowering the goal is faster and feels reasonable ("we need to be realistic"). The pressure releases. The next time, the goal is lowered again. Over years, the standard quietly degrades. Nobody made an explicit decision to lower it.

## Generic structure

```esteem.cld
variables:
  - gap
  - pressure-to-improve
  - actual-performance
  - target

links:
  target              → gap                   [+]
  actual-performance  → gap                   [-]
  gap                 → pressure-to-improve   [+]
  pressure-to-improve → actual-performance    [+, delay:high]
  gap                 → target                [-, delay:low]

loops:
  B1 [balancing]: gap → pressure-to-improve → actual-performance → gap
  B2 [balancing]: gap → target → gap
```

## Slots

| Slot | What goes here |
|---|---|
| `target` | The original goal or standard |
| `actual-performance` | The current reality |
| `gap` | The difference between target and reality |
| `pressure-to-improve` | What the gap mobilizes when it is felt as pressure |

## Recognition triggers

- "we revised the target"
- "good enough"
- "the bar keeps dropping"
- "we used to demand more here"

## Classic example

A team commits to a 99% uptime SLO. They miss it. After a postmortem they decide 95% is more realistic. They miss that too. Two years on, the SLO is 90% and nobody remembers why it ever was 99%.

## Sources

Senge, *The Fifth Discipline*, archetype #5.
