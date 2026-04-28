# Esteem – Project Conventions

## What This Is

A Claude Code plugin for **Systems Thinking support** — explaining canonical thinking models (CLD, CRT/FRT, EC, Ladder of Inference, First Principles, PRT/TrT, Systems Archetypes) and facilitating their use through lightweight to facilitator-style dialog.

Sibling to **Libertee** under the DWSD umbrella. Libertee opens the space (divergent), Esteem closes it (convergent).

Status: Konzeptphase. Reference planning: `../202604 esteem marketing/origin/esteem-planning.md`.

## Core Distinction (vs. Libertee)

| | Libertee | Esteem |
|---|---|---|
| Direction | divergent | convergent |
| Agent role | Protagonist | Reasoning-Partner |
| Cognitive load | on agent | on user |
| Input | minimal seed | context-rich dialog |
| Output | perspectives, scenarios | structure, validation |

The agent **structures, checks, mirrors** — it does not generate the thinking.

## Two-Layer Architecture (CRITICAL)

Esteem keeps two layers explicitly separated from day one. This is the central design constraint and the main thing Libertee did *not* do.

### Layer 1 — Models (`models/`)
Stable, domain-independent thinking structures. **No facilitation, no dramaturgy.** Pure epistemic form — versionable, referenceable, composable.

Examples: CLD logic, CRT logic, EC structure, archetypes (Fixes that Fail, Shifting the Burden, …).

### Layer 2 — Facilitation Skills (`skills/`)
Thinking arcs that situationally combine models. Dramaturgy, transitions, navigation. A skill **invokes** a model — it does not redefine it.

**Rule:** A skill must never embed model logic inline. It references model files. If you find yourself copying CLD rules into a skill, stop and extract them to `models/cld/`.

## Three Agent Roles (situational)

- **Elicitor** — asks, structures spoken language into the tool (CRT, EC, Ladder)
- **Validator** — checks the logic of a finished structure (CRT verification, FRT)
- **Pattern Matcher** — recognizes archetype patterns from situation descriptions (CLD entry)

Pick the role per facilitation skill — don't blend.

## File Conventions

- YAML frontmatter on all skill, agent, and model files
- Skills carry `user-invocable: true` and an `argument-hint`
- Agent model: `sonnet` (focused perspectives, cost-effective). Reserve `opus` for synthesis only if needed.
- Agent maxTurns: 3–5
- All agents respond in the user's detected language (runtime i18n) — same convention as Libertee

## DSL & Markdown

Markdown is the source of truth. DSL blocks live as fenced code blocks:

```
```cld    – Causal Loop Diagram
```crt    – Current Reality Tree
```frt    – Future Reality Tree
```ec     – Evaporating Cloud
```

Model files in `models/<model>/` define the DSL grammar and validation rules. Skills reference them.

## Repo Structure (planned)

```
esteem/
  .claude-plugin/
    plugin.json
    marketplace.json
  models/                    – Layer 1: pure model logic + DSL specs
    cld/
      cld-logic.md
      archetypes/
        fixes-that-fail.md
        shifting-the-burden.md
        ...
    crt/ frt/ ec/ ladder-of-inference/ first-principles/ prt/ trt/
  skills/                    – Layer 2: facilitation arcs (Claude Code plugin skills)
    diagnostic-arc/
    conflict-resolution/
    future-design/
    shared/
  examples/
  assets/
  README.md
  CLAUDE.md
```

Mirrors Libertee's plugin layout (`.claude-plugin/`, `skills/`) but adds the dedicated `models/` tree to keep Layer 1 separate.

## Open Decisions (do not lock without discussion)

- ESTEEM acronym (EEM letters unresolved)
- DSL syntax family: YAML-style vs. code-style
- Render target for diagrams: D3 vs. own SVG renderer (relevant later for any VSCode-side preview)
- Whether First Principles lives in Esteem or stays in Libertee
- First archetype to implement end-to-end ("Fixes that Fail" is the candidate)

See planning doc for full list.

## Working Conventions

- **Plugin language: English.** All plugin sources — skill files, agent files, model files, archetype files, README, examples — are written in English. Same constraint as Libertee. Conversation between Thomas and the assistant may be German; the artifacts must be English so they work for any user and match the Libertee convention.
- Reference Libertee freely as the technical pattern, but flag every place where Esteem must diverge (two-layer separation, reasoning-partner stance).
- Planning lives in the project directory; the conceptual planning doc currently sits in `../202604 esteem marketing/origin/esteem-planning.md` and is the canonical source until we move it.
