---
name: escalation
display-name: "Escalation"
description: "Two parties' defensive responses to each other amplify into a runaway cycle that neither wanted"
layer: 1
model: cld
type: archetype
status: stub
---

# Escalation

## Signature

Two actors each measure their position relative to the other. When one perceives a disadvantage, they respond — which the other perceives as a threat — and they respond. Each step is locally rational and reactive. The structure is two coupled balancing loops that, when they share a perception variable, behave as a runaway reinforcing dynamic for the system as a whole.

## Generic structure

```cld
variables:
  - a-action
  - b-action
  - a-relative-position
  - b-relative-position

links:
  a-action            → a-relative-position [+]
  a-action            → b-relative-position [-]
  b-relative-position → b-action            [+]
  b-action            → b-relative-position [+]
  b-action            → a-relative-position [-]
  a-relative-position → a-action            [-]

loops:
  B1 [balancing]: a-relative-position → a-action → a-relative-position
  B2 [balancing]: b-relative-position → b-action → b-relative-position
```

(System-level: each actor's balancing behavior, when coupled, drives the joint state — both actions — to extremes.)

## Slots

| Slot | What goes here |
|---|---|
| `a-action` | What party A does to defend or compete |
| `b-action` | What party B does to defend or compete |
| `a-relative-position` | A's perceived standing vs. B |
| `b-relative-position` | B's perceived standing vs. A |

## Recognition triggers

- "arms race"
- "tit for tat"
- "they raised, so we had to raise"
- "neither side wanted this"
- "we're locked in a spiral"

## Classic example

Two companies in a price war. Each cuts to undercut the other. Margins collapse. Neither wants the outcome. Both feel they had no choice given the other's behavior.

## Sources

Senge, *The Fifth Discipline*, archetype #6.
