---
name: growth-and-underinvestment
display-name: "Growth and Underinvestment"
description: "Growth stalls because investment in the capacity that would sustain it is always trailing the need, often because the need is judged by current rather than future demand"
layer: 1
model: cld
type: archetype
status: stub
---

# Growth and Underinvestment

## Signature

A reinforcing growth loop is constrained by capacity. Investment could expand capacity — but the decision to invest is made against current demand, not anticipated demand, and capacity takes time to come online. By the time capacity arrives, demand has either grown past it (more underinvestment) or shifted away (the investment looks wasted). The growth loop cannot run at its potential and quality of service degrades.

## Generic structure

```esteem.cld
variables:
  - demand
  - service-quality
  - capacity
  - investment-in-capacity
  - perceived-need-to-invest

links:
  demand                   → perceived-need-to-invest [+]
  perceived-need-to-invest → investment-in-capacity   [+]
  investment-in-capacity   → capacity                 [+, delay:high]
  capacity                 → service-quality          [+]
  service-quality          → demand                   [+]
  demand                   → service-quality          [-]

loops:
  R1 [reinforcing]: demand → service-quality → demand
  B1 [balancing]:   demand → service-quality → demand (via capacity erosion)
  B2 [balancing]:   demand → perceived-need-to-invest → investment-in-capacity → capacity → service-quality → demand
```

## Slots

| Slot | What goes here |
|---|---|
| `demand` | The growing volume the system must serve |
| `service-quality` | Quality experienced by users / customers |
| `capacity` | The system's ability to deliver |
| `investment-in-capacity` | Investment that expands capacity |
| `perceived-need-to-invest` | The signal that drives investment decisions |

## Recognition triggers

- "we can't keep up"
- "demand outran capacity"
- "we should have invested earlier"
- "the wait time keeps growing"

## Classic example

A web service goes viral. Latency rises. Users churn. Engineering wants to scale infrastructure but the budget cycle is annual; the demand signal arrives after the budget is set. By the time capacity is added, the user base has plateaued from the bad experience.

## Sources

Senge, *The Fifth Discipline*, archetype #9.
