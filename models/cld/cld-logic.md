---
name: cld-logic
description: "Semantics of Causal Loop Diagrams — what variables, links, loops and delays mean, and when a CLD is well-formed"
layer: 1
model: cld
---

# Causal Loop Diagram — Model Logic

A **Causal Loop Diagram (CLD)** makes circular causality in a system visible: which quantities act on which, in which direction, with what delay — and which of those effects close into loops that drive the system's dynamics.

CLDs are **convergent**: they structure and test assumptions about a system. They do not generate new ideas — they sharpen the ones you already have.

---

## Variable

A **variable** is a named quantity that can change — it can rise or fall.

- Variables are not states ("employee is tired") but quantities ("fatigue", "hours per week", "error rate")
- Good variable names are **neutral nouns**, not judgments ("workload" rather than "overload")
- One variable stands for *one* quantity — if two things move together, name them as two variables

## Link

A **link** is a directed effect from one variable to another. Every link has a **polarity**:

- **`+` (same direction)** — when the cause rises, the effect rises. When the cause falls, the effect falls. *Example: number of requests `+→` support team workload.*
- **`−` (opposite direction)** — when the cause rises, the effect falls. When the cause falls, the effect rises. *Example: WIP limit `−→` parallel work in progress.*

**Important**: polarity describes the *direction of change*, not moral valence. A `−` link can be good or bad.

## Delay

A **delay** is a meaningful temporal gap between cause and effect — large enough to change the system's behavior.

- Levels: `none` (immediate), `low` (noticeable but short), `high` (dominates the dynamic)
- **Delays are system-critical**: many archetypes work *because* one effect arrives later than another — a symptomatic fix acts immediately, the fundamental solution only later
- When uncertain, mark `low` rather than nothing — the question itself sharpens the picture

## Loop

A **loop** forms when links chain into a circle — A acts on B, B on C, C back on A. Loops are the core epistemic object of a CLD: they show how a system carries itself.

Two loop types:

- **Reinforcing (R)** — the loop amplifies itself. Growth or collapse. Snowball effects.
- **Balancing (B)** — the loop self-corrects. It moves toward a goal state or holds an equilibrium.

### Polarity rule for loop type

Count the number of `−` links in the loop:

- **Even number of `−` links → Reinforcing (R)**
- **Odd number of `−` links → Balancing (B)**

(Intuition: each `−` flips the sign once. An even number of flips leaves the sign unchanged — self-amplification. An odd number reverses it — self-damping.)

---

## Well-formedness

A CLD is **well-formed** when:

1. Every variable used in `links` and `loops` is also declared in `variables`
2. Every link carries an explicit polarity (`+` or `−`)
3. Every loop contains at least 2 variables and closes (first variable = last variable)
4. Every declared loop type (R / B) matches the polarity rule
5. At least one loop exists — otherwise it is not a CLD but a causal tree (→ see CRT)

A CLD may:
- contain multiple loops (this is typical — most archetypes consist of 2 loops)
- share variables across loops (coupling)
- include variables that are not part of any loop (open drivers/effects)

---

## What a CLD is *not*

- **Not a flowchart**: variables are not steps in a procedure, they are quantities.
- **Not a causal tree (CRT)**: a CRT shows a directed argumentation chain without loops. If your diagram has no loop, you probably need a CRT, not a CLD.
- **Not a quantification**: CLDs say nothing about *how much* one variable affects another. They structure direction, not magnitude. For magnitudes → System Dynamics model.

---

## Reference: DSL

The syntactic form of a CLD lives in `models/cld/dsl.md`. This file describes only **meaning**, not notation.

## Reference: archetypes

Recurring loop patterns are catalogued as **archetypes** in `models/cld/archetypes/`. A concrete CLD can be an archetype instance — in that case it points at the archetype and maps the archetype's generic variable slots to concrete names.
