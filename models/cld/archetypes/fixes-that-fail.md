---
name: fixes-that-fail
display-name: "Fixes that Fail"
description: "A fix works short-term but creates a worse version of the original problem later, often through a delayed unintended consequence"
layer: 1
model: cld
type: archetype
---

# Fixes that Fail

## Signature

A problem appears. A fix is applied. The symptom recedes — for a while. But the fix has an unintended side-effect that, after a delay, makes the original problem worse than before. The same fix is applied again, more aggressively. The system spirals.

The structure is two coupled loops:

- **B1 (the fix)** — balancing: problem symptom drives the quick fix, which reduces the symptom
- **R1 (the trap)** — reinforcing: the quick fix produces an unintended consequence that, after a delay, amplifies the original symptom

The R1 loop only becomes visible when the delay plays out. Until then, the fix looks like it works. That is the trap.

## Generic structure

```esteem.cld
# title: Fixes that Fail (archetype)

variables:
  - problem-symptom
  - quick-fix
  - unintended-consequence

links:
  problem-symptom        → quick-fix              [+]
  quick-fix              → problem-symptom        [-]
  quick-fix              → unintended-consequence [+, delay:high]
  unintended-consequence → problem-symptom        [+]

loops:
  B1 [balancing]:    problem-symptom → quick-fix → problem-symptom
  R1 [reinforcing]:  problem-symptom → quick-fix → unintended-consequence → problem-symptom
```

(B1 has one `−` link → balancing. R1 has one `−` link, but it traverses the unintended-consequence side which adds two `+` links — total `−` count is one in the cycle `problem → fix → consequence → problem`. Wait: `problem → fix` is `+`, `fix → consequence` is `+`, `consequence → problem` is `+`. Zero `−` links. Even. Reinforcing. ✓)

## Slots (variables to fill in an instance)

| Slot | What goes here |
|---|---|
| `problem-symptom` | The visible pain that triggers action |
| `quick-fix` | The intervention that reduces the symptom in the short term |
| `unintended-consequence` | The side-effect of the fix that, delayed, worsens the symptom |

## Recognition triggers

Listen for these phrases in the user's situation description:

- "every time we fix it, it comes back bigger"
- "the fix made things worse"
- "déjà vu — we solved this last quarter and it's back"
- "we keep applying the same patch and it stops working sooner each time"
- "the cure is worse than the disease"
- "we're playing whack-a-mole"

If two or more of these show up, *Fixes that Fail* is a strong candidate.

## How it differs from neighbors

- **vs. Shifting the Burden**: Shifting the Burden also has a quick fix and a fundamental solution, but the trap there is *dependency on the fix* eroding the capacity to apply the fundamental solution. In Fixes that Fail, the fix actively *creates* the worsened problem.
- **vs. Escalation**: Escalation involves two parties amplifying each other. Fixes that Fail is one actor's loop with itself.
- **vs. Limits to Growth**: Limits to Growth slows growth via a hidden constraint. Fixes that Fail makes a problem *worse*, not just unable to grow.

## Classic example — the hiring treadmill

A team is overloaded. Sprint reliability drops. Management hires more people to relieve the load. In the short term, capacity rises and the symptom recedes. But onboarding new hires consumes senior time, fragments knowledge, and increases coordination overhead. After a few months, the team is more overloaded than before — so they hire again, harder. Each cycle adds people but reduces effective capacity per person.

```esteem.cld
# title: Hiring treadmill — Fixes that Fail instance
# status: example
# created: 2026-04-28

variables:
  - team-overload
  - hiring
  - onboarding-and-coordination-burden

links:
  team-overload                       → hiring                              [+]
  hiring                              → team-overload                       [-]
  hiring                              → onboarding-and-coordination-burden  [+, delay:high]
  onboarding-and-coordination-burden  → team-overload                       [+]

loops:
  B1 [balancing]:   team-overload → hiring → team-overload
  R1 [reinforcing]: team-overload → hiring → onboarding-and-coordination-burden → team-overload

archetype: fixes-that-fail
instance: hiring-treadmill
  map:
    problem-symptom        → team-overload
    quick-fix              → hiring
    unintended-consequence → onboarding-and-coordination-burden
```

## How to break out of it

The leverage point is **not** to remove the fix — that returns the original symptom. The leverage points are:

1. **Slow the fix down enough that the unintended consequence becomes visible** before the next reflexive application — i.e. wait, observe, name the side-effect
2. **Address the unintended consequence directly** while accepting the original symptom temporarily
3. **Find a fundamental solution** that targets the symptom *without* the side-effect — this is usually slower and harder, which is why the fix was tempting in the first place

A facilitator's job is to make the R1 loop visible. Once the user can see it, the choice becomes intentional rather than reflexive.

## Sources

- Peter M. Senge, *The Fifth Discipline*, archetype #4 (Fixes that Backfire / Fixes that Fail)
- Daniel H. Kim, "Systems Archetypes I" (Pegasus, 1992)
