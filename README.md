# Esteem

Systems Thinking support for Claude Code — explains canonical thinking models and helps you build them with you, not for you.

Convergent counterpart to [Libertee](https://github.com/worksystems-design/libertee). Where Libertee opens the space (perspectives, scenarios, what-ifs), Esteem closes it (structure, validation, causality). Both are part of the **DWSD** umbrella for structured thinking.

> Status: **early v0.1** — first model (Causal Loop Diagrams) and first archetype (Fixes that Fail) shipped end-to-end. More models and archetypes to come.

## Table of Contents

- [What it does](#what-it-does)
- [Two layers, by design](#two-layers-by-design)
- [Available skills](#available-skills)
- [The model — Causal Loop Diagrams](#the-model--causal-loop-diagrams)
- [Archetypes](#archetypes)
- [Installation](#installation)
- [How it works](#how-it-works)
- [Roadmap](#roadmap)

## What it does

Esteem helps you think structurally about systems. Right now it covers:

- **Teach** — explains Causal Loop Diagrams and the twelve canonical archetypes from Senge's *Fifth Discipline*, in dialog, at your pace
- **Build** — co-creates a `.cld.md` file with you from a situation you describe, asking focused questions, writing each confirmed step into the file

The agent is a **reasoning partner**, not a protagonist. The cognitive work stays with you. Esteem structures, checks, and mirrors.

## Two layers, by design

Esteem keeps two layers strictly separated — this is the central architectural choice and the main thing that distinguishes it from Libertee:

- **Layer 1 — Models** (`models/`): pure, domain-independent thinking structures. The DSL grammar. The semantics of variables, links, loops. The catalog of archetypes. No dramaturgy.
- **Layer 2 — Facilitation** (`skills/`): the dialog arcs that *invoke* the models. Questions, transitions, dramaturgy. Skills reference model files; they never duplicate model logic inline.

The separation means models are versionable and reusable across skills, and skills can evolve their facilitation style without dragging the canonical knowledge along.

## Available skills

### `/esteem:cld-teach`

Teach Causal Loop Diagrams or a specific archetype, in conversation. No file output.

```bash
/esteem:cld-teach                   # default: basics of CLDs
/esteem:cld-teach basics            # explicit
/esteem:cld-teach archetypes        # explain what archetypes are, show the index
/esteem:cld-teach fixes-that-fail   # deep dive into one archetype
/esteem:cld-teach limits-to-growth
# ... any of the twelve archetype IDs
```

### `/esteem:cld-build`

Co-create a CLD with the user. Produces a `.cld.md` file in the current directory, written turn by turn through focused questions. Optionally suggests a matching archetype at the end.

```bash
/esteem:cld-build                                       # asks for the situation
/esteem:cld-build "we keep missing sprint commitments"  # short framing as argument
/esteem:cld-build "..." --no-archetype                  # skip the archetype-match step
```

## The model — Causal Loop Diagrams

A CLD makes circular causality in a system visible: which quantities act on which, in which direction, with what delay — and which effects close into loops.

Esteem's CLDs use a small textual DSL inside a fenced ```cld block:

```cld
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
```

Full grammar in [`models/cld/dsl.md`](models/cld/dsl.md). Semantics in [`models/cld/cld-logic.md`](models/cld/cld-logic.md).

## Archetypes

The twelve canonical Systems Thinking archetypes are catalogued in [`models/cld/archetypes/`](models/cld/archetypes/), with [`_index.md`](models/cld/archetypes/_index.md) as the lookup table:

1. Balancing Process with Delay
2. Limits to Growth
3. Shifting the Burden
4. Shifting the Burden to the Intervenor
5. Eroding Goals
6. Escalation
7. Success to the Successful
8. Tragedy of the Commons
9. **Fixes that Fail** (full reference example)
10. Growth and Underinvestment
11. Accidental Adversaries
12. Rule Beating

Each archetype file lists its signature, generic structure as a CLD-DSL block, slots, recognition triggers, and a classic example.

## Installation

### From GitHub

```bash
/plugin marketplace add worksystems-design/esteem
/plugin install esteem@worksystems-design-esteem
```

Restart Claude Code after installation.

### Try locally

```bash
git clone https://github.com/worksystems-design/esteem.git
claude --plugin-dir ./esteem
```

### Uninstall

```bash
/plugin uninstall esteem@worksystems-design-esteem
```

## How it works

**Plugin layout:**

```
esteem/
  .claude-plugin/
    plugin.json
    marketplace.json
  models/
    cld/
      cld-logic.md          – semantics
      dsl.md                – DSL grammar v0.1
      archetypes/
        _index.md
        fixes-that-fail.md  – full reference
        ... eleven more
  skills/
    cld-teach/
      SKILL.md
    cld-build/
      SKILL.md
      agents/
        elicitor.md
  examples/
  README.md
  CLAUDE.md
```

**Two layers, separated:**
- Skills only reference model files — they never embed model logic
- Models are pure knowledge — no facilitation, no dramaturgy

**Cross-platform:**
- Esteem is built to work in both local Claude Code and Claude Cowork
- Single-file artifacts, no folder structures, no sidecars

**Language:**
- Skills detect the user's language and respond in kind
- Variable names stay in `kebab-case`, language-neutral within each CLD

## Roadmap

**v0.2 — Pattern Matcher**
- New skill `/esteem:cld-detect` — recognize an archetype from a situation description, without first building a CLD

**v0.3 — Validator**
- New skill `/esteem:cld-validate <file>` — check an existing `.cld.md` for well-formedness and loop-type consistency

**v0.4+ — More models**
- Current Reality Tree (CRT)
- Future Reality Tree (FRT)
- Evaporating Cloud (EC)
- Ladder of Inference
- First Principles Decomposition (subject to scope split with Libertee)
- Prerequisite Tree (PRT) and Transition Tree (TrT)

**Later**
- Session-recorder skill or hook (separate from build skills) — capture reasoning history
- VSCode-side preview of `.cld.md` (separate project, not part of this plugin)

## Examples

- [`examples/fixes-that-fail-session.md`](examples/fixes-that-fail-session.md) — a full transcript of `/esteem:cld-build` constructing a Fixes-that-Fail instance

## License

MIT — see LICENSE.

## Trademark notice

The archetypes and methods referenced are catalogued for educational purposes. Esteem is not affiliated with or endorsed by:

- **Peter M. Senge** and the work in *The Fifth Discipline* (1990, 2006), where eight of the canonical archetypes were popularized
- **Pegasus Communications** and the *Systems Archetypes* publications by Daniel H. Kim and Virginia Anderson
- The **Society for Organizational Learning (SoL)**

## Author

Thomas Krause — [worksystems.design](https://worksystems.design)
