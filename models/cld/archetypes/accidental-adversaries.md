---
name: accidental-adversaries
display-name: "Accidental Adversaries"
description: "Two parties whose cooperation would benefit both drift into mutual obstruction through small reciprocal frustrations"
layer: 1
model: cld
type: archetype
status: stub
---

# Accidental Adversaries

## Signature

Two parties (teams, departments, partners) initially cooperate; their joint success depends on it. Each party occasionally takes a local action that helps itself but mildly hurts the other. The other party, in response, takes a local protective action that mildly hurts the first. Each step is small and reasonable. Over many iterations, cooperation erodes; both parties now experience the other as a blocker. Neither chose this, but the structure produced it.

## Generic structure

```esteem.cld
variables:
  - a-success
  - b-success
  - a-local-action
  - b-local-action

links:
  a-success      → b-success      [+]
  b-success      → a-success      [+]
  a-local-action → a-success      [+]
  a-local-action → b-success      [-, delay:low]
  b-local-action → b-success      [+]
  b-local-action → a-success      [-, delay:low]
  a-success      → a-local-action [-]
  b-success      → b-local-action [-]

loops:
  R1 [reinforcing]: a-success → b-success → a-success         (the cooperation loop)
  R2 [reinforcing]: a-local-action → a-success / b-success    (the adversary loop, mediated by reactive protection)
```

## Slots

| Slot | What goes here |
|---|---|
| `a-success`, `b-success` | The partners' outcomes |
| `a-local-action`, `b-local-action` | Local protective or self-serving moves |

## Recognition triggers

- "we used to work together well"
- "now they're blocking us"
- "neither side wanted this"
- "small frustrations added up"

## Classic example

Sales and engineering. Sales commits to a feature for a key customer. Engineering scrambles, delivers late, builds a brittle version. Sales is frustrated and stops looping engineering in early on the next deal. Engineering is frustrated and stops trusting sales' commitments. Two years later, the relationship is hostile.

## Sources

Senge & Kim, extension to *The Fifth Discipline*. Daniel H. Kim, "Systems Archetypes II".
