---
name: shifting-the-burden
display-name: "Shifting the Burden"
description: "A symptomatic fix relieves pressure, which reduces the motivation to apply the fundamental solution; over time the system loses the capacity for the fundamental solution"
layer: 1
model: cld
type: archetype
status: stub
---

# Shifting the Burden

## Signature

A problem has two solutions: a quick symptomatic fix and a slower fundamental solution. The quick fix is applied because it is faster. It works — the symptom recedes. With less pressure, no one applies the fundamental solution. The capability for the fundamental solution atrophies. The system becomes dependent on the quick fix and can no longer do without it.

## Generic structure

```cld
variables:
  - problem-symptom
  - symptomatic-fix
  - fundamental-solution
  - side-effect

links:
  problem-symptom      → symptomatic-fix       [+]
  symptomatic-fix      → problem-symptom       [-]
  problem-symptom      → fundamental-solution  [+]
  fundamental-solution → problem-symptom       [-, delay:high]
  symptomatic-fix      → side-effect           [+, delay:high]
  side-effect          → fundamental-solution  [-]

loops:
  B1 [balancing]:   problem-symptom → symptomatic-fix → problem-symptom
  B2 [balancing]:   problem-symptom → fundamental-solution → problem-symptom
  R1 [reinforcing]: problem-symptom → symptomatic-fix → side-effect → fundamental-solution → problem-symptom
```

## Slots

| Slot | What goes here |
|---|---|
| `problem-symptom` | The pressure that triggers action |
| `symptomatic-fix` | The faster, easier intervention that addresses symptoms |
| `fundamental-solution` | The slower, harder intervention that addresses causes |
| `side-effect` | What the symptomatic fix produces that erodes capacity for the fundamental solution |

## Recognition triggers

- "we never get to the root cause"
- "the workaround became the way we do things"
- "we lost the skill / muscle / institutional knowledge for X"
- "we're addicted to the quick fix"

## Classic example

An organization hires consultants to handle a recurring strategy question. The consultants deliver. The internal team never builds strategy capability. Years later the firm cannot do strategy without external help.

## How it differs from Fixes that Fail

In Fixes that Fail, the fix actively *creates* a worse version of the original problem (one R-loop). In Shifting the Burden, the fix *erodes the capacity to apply the fundamental solution* — the trap is dependency, not amplification.

## Sources

Senge, *The Fifth Discipline*, archetype #3.
