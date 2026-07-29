# Example session — `/esteem:cld-build`

A full transcript of co-creating a Fixes-that-Fail CLD for the classic "hiring treadmill" pattern. The user's situation: a team that keeps hiring to relieve overload, but each round of hiring makes things worse over time.

This transcript is condensed for readability; a real session has more pauses and side-questions.

---

**User:** `/esteem:cld-build "our team keeps growing but we're more overloaded each quarter"`

**Esteem:** Let's understand the situation first before I start a file. When you say "more overloaded each quarter" — is the load growing because the work is growing, or because something about the team itself is changing?

**User:** Both, but mostly the team. We hired six people last year. Velocity went up for two months, then dropped below where it was before. So we hired four more this quarter, and we're seeing the same pattern starting.

**Esteem:** That's a clear repeating pattern — hiring brings short-term relief, then things get worse. Two more questions before we put pen to paper:

- What is the senior team's experience between hires? Is there a coordination cost you can name?
- And when you say "velocity dropped" — is that about throughput, or about quality of decisions?

**User:** Mostly throughput. And yes — every senior is spending three to five hours a week onboarding plus running standups for sub-teams that didn't exist before. So a lot of context-switching.

**Esteem:** That gives me a clear shape. Let me create the file.

> Default path: `./hiring-treadmill.cld.md` in your current directory. Different path?

**User:** Default is fine.

**Esteem:** *(creates the file)*

```markdown
---
title: Hiring treadmill
status: draft
created: 2026-04-28
---

# Hiring treadmill

A team that keeps growing but feels more overloaded each quarter. Hiring rounds bring short-term capacity relief but introduce onboarding and coordination overhead that, after a delay, makes the team's overall load worse than before. The pattern has repeated at least twice.

```esteem.cld
variables:

links:

loops:
```
````

Does that framing paragraph capture your situation? Adjust before we go further.

**User:** Yes, that's it.

**Esteem:** Good. Let me start with variables. From what you said, I hear at least three things:

- the team's overload (the symptom)
- hiring (the action)
- onboarding-and-coordination-burden (the side-effect)

Are these the right three, with those names?

**User:** Yes, but call the third one just "coordination overhead" — onboarding is a small piece of it.

**Esteem:** Got it. *(adds to file)*

> Added `team-overload`, `hiring`, `coordination-overhead` to variables.

Next, links. When `team-overload` rises, what does the team do?

**User:** Hire.

**Esteem:** So `team-overload → hiring`, polarity `+` (more overload, more hiring). Confirmed?

**User:** Yes.

**Esteem:** *(writes link)*

> Added `team-overload → hiring [+]`.

When `hiring` happens, what is the immediate effect on overload?

**User:** It drops, for a couple of months.

**Esteem:** So `hiring → team-overload` with polarity `−`, immediate. Confirmed?

**User:** Yes.

**Esteem:** *(writes link)*

> Added `hiring → team-overload [-]`.

Now the trickier one. When `hiring` happens, what does it do to `coordination-overhead`?

**User:** It increases. But not immediately — it takes a few weeks before the new hires start needing real onboarding time.

**Esteem:** So `hiring → coordination-overhead`, polarity `+`, with a delay. You said "a few weeks" — is that a meaningful delay, or short enough to ignore?

**User:** Meaningful. By the time we feel it, we've often committed to more hires.

**Esteem:** Then `delay:high`. *(writes link)*

> Added `hiring → coordination-overhead [+, delay:high]`.

And the last one — what does `coordination-overhead` do back to `team-overload`?

**User:** It pushes it up. Each senior spends real hours per week on the overhead, so they have less time for actual work.

**Esteem:** So `coordination-overhead → team-overload`, polarity `+`. Confirmed?

**User:** Yes.

**Esteem:** *(writes link)*

> Added `coordination-overhead → team-overload [+]`.

I see two loops now. First: `team-overload → hiring → team-overload`. That's a balancing loop — when overload rises, hiring rises, which reduces overload. One `−` link in the cycle. Want me to call it `B1`?

**User:** Yes.

**Esteem:** *(writes loop)*

> Added `B1 [balancing]: team-overload → hiring → team-overload`.

Second loop: `team-overload → hiring → coordination-overhead → team-overload`. That's three `+` links — even count of `−` links, so this is reinforcing. Call it `R1`?

**User:** Yes.

**Esteem:** *(writes loop)*

> Added `R1 [reinforcing]: team-overload → hiring → coordination-overhead → team-overload`.

The `R1` is the trap — every hire makes the overload problem worse over time, but the effect is delayed so it doesn't show up until you're already mid-way through the next hire. The classic Fixes-that-Fail shape.

Let me run the validity check:

- 3 variables, all referenced
- 4 links, all with explicit polarity
- 2 loops, both close, types match the polarity rule
- ✓ well-formed

Want me to check whether this matches a known archetype?

**User:** Yes.

**Esteem:** *(reads `_index.md`, then `fixes-that-fail.md`)*

This is **Fixes that Fail** — a fix relieves a symptom in the short term but produces an unintended consequence that, after a delay, makes the symptom worse. The slots line up:

| Archetype slot | Your variable |
|---|---|
| `problem-symptom` | `team-overload` |
| `quick-fix` | `hiring` |
| `unintended-consequence` | `coordination-overhead` |

Add the archetype reference to the file?

**User:** Yes.

**Esteem:** *(appends to file)*

> Added `archetype: fixes-that-fail` and `instance: hiring-treadmill` with the slot mapping.

Final file at `./hiring-treadmill.cld.md`. Summary:

- 3 variables, 4 links, 2 loops (1 R, 1 B)
- Identified as **Fixes that Fail** instance
- The leverage point isn't to stop hiring — that returns the overload. The leverage points are: surface the R1 loop visibly *before* the next hiring decision, address coordination-overhead directly, or find a fundamentally different way to distribute load that doesn't grow with team size.

Edit by hand if you want to refine, or come back later with a different lens.

---

## What the resulting file looks like

```markdown
---
title: Hiring treadmill
status: draft
created: 2026-04-28
---

# Hiring treadmill

A team that keeps growing but feels more overloaded each quarter. Hiring rounds bring short-term capacity relief but introduce onboarding and coordination overhead that, after a delay, makes the team's overall load worse than before. The pattern has repeated at least twice.

```esteem.cld
variables:
  - team-overload
  - hiring
  - coordination-overhead

links:
  team-overload         → hiring                  [+]
  hiring                → team-overload           [-]
  hiring                → coordination-overhead   [+, delay:high]
  coordination-overhead → team-overload           [+]

loops:
  B1 [balancing]:   team-overload → hiring → team-overload
  R1 [reinforcing]: team-overload → hiring → coordination-overhead → team-overload

archetype: fixes-that-fail
instance: hiring-treadmill
  map:
    problem-symptom        → team-overload
    quick-fix              → hiring
    unintended-consequence → coordination-overhead
```
````

---

## What is and isn't captured

**Captured in the file:**
- The structure (variables, links, loops)
- The archetype identification with slot mapping
- The framing context

**Not captured:**
- The dialog itself — the questions, hesitations, refinements (e.g., the rename from "onboarding-and-coordination-burden" to "coordination-overhead")
- The leverage-point reasoning at the end

In v0.1, these live in the chat session and are ephemeral. v0.2+ may add a separate session-recorder skill or hook to capture them.
