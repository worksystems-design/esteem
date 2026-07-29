---
name: balancing-process-with-delay
display-name: "Balancing Process with Delay"
description: "A correction overshoots its target because feedback about its effect arrives too late"
layer: 1
model: cld
type: archetype
status: stub
---

# Balancing Process with Delay

## Signature

An actor adjusts toward a target. The effect of the adjustment is delayed. By the time it shows up, the actor has already adjusted further — overshoots the target — then over-corrects in the opposite direction. The system oscillates instead of settling.

## Generic structure

```esteem.cld
variables:
  - gap-to-target
  - corrective-action
  - state

links:
  gap-to-target     → corrective-action  [+]
  corrective-action → state              [+, delay:high]
  state             → gap-to-target      [-]

loops:
  B1 [balancing]: gap-to-target → corrective-action → state → gap-to-target
```

## Slots

| Slot | What goes here |
|---|---|
| `gap-to-target` | Difference between current state and goal |
| `corrective-action` | The adjustment intended to close the gap |
| `state` | The current observable state, updated only after the delay |

## Recognition triggers

- "we keep over-correcting"
- "by the time we see the effect, we've already changed course again"
- "the system swings"
- "we are always too late"

## Classic example

A shower with slow-responding hot water. Turn it up — nothing happens — turn it up more — suddenly scalding — turn it down hard — freezing. The delay between handle and temperature drives the oscillation.

## Sources

Senge, *The Fifth Discipline*, archetype #1.
