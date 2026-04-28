---
name: rule-beating
display-name: "Rule Beating"
description: "Actors comply with the letter of a rule or metric while defeating its purpose, so the metric improves without the underlying outcome improving"
layer: 1
model: cld
type: archetype
status: stub
---

# Rule Beating

## Signature

A goal is hard to measure directly, so a proxy metric is used. The metric becomes the target. Actors learn to optimize the metric in ways that do not improve — and may degrade — the underlying goal. The metric improves; the goal does not. The rule was never wrong; the optimization pressure overwhelmed it. (Goodhart's Law.)

## Generic structure

```cld
variables:
  - underlying-goal
  - metric
  - rule-beating-effort
  - genuine-improvement-effort

links:
  metric                     → rule-beating-effort        [+]
  rule-beating-effort        → metric                     [+]
  rule-beating-effort        → underlying-goal            [-, delay:low]
  genuine-improvement-effort → underlying-goal            [+, delay:high]
  underlying-goal            → metric                     [+]
  metric                     → genuine-improvement-effort [-]

loops:
  R1 [reinforcing]: metric → rule-beating-effort → metric (the gaming loop)
  B1 [balancing]:   underlying-goal → metric → genuine-improvement-effort → underlying-goal (the intended loop, weakened)
```

## Slots

| Slot | What goes here |
|---|---|
| `underlying-goal` | The thing the system actually cares about |
| `metric` | The proxy used to measure it |
| `rule-beating-effort` | Activity optimizing the metric without improving the goal |
| `genuine-improvement-effort` | Activity that actually improves the goal |

## Recognition triggers

- "they game the metric"
- "letter not spirit"
- "the KPI went up but nothing improved"
- "we measured the wrong thing"

## Classic example

A support team is measured on tickets closed per day. Closing rate rises. Customers complain that issues are not actually resolved — tickets are closed prematurely and reopened under new ticket numbers. The metric improved; service did not.

## Sources

Donella Meadows, *Thinking in Systems* (chapter on system traps). Goodhart's Law (Charles Goodhart, 1975).
