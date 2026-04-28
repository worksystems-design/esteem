# Contributing to Esteem

Thanks for your interest in contributing!

Esteem is the convergent sibling of [Libertee](https://github.com/worksystems-design/libertee). If Libertee opens the space (divergent thinking, perspectives, scenarios), Esteem closes it (structure, validation, causality). The agent is a **reasoning partner** — it structures, checks, and mirrors. It does not generate the thinking for the user.

Contributions are welcome. Read this whole file before opening a PR — it documents conventions that are not obvious from the code.

## Scope

Esteem includes models and skills from these domains:

- **Causal modeling** — Causal Loop Diagrams (CLDs), archetypes, system dynamics structures
- **Logical reasoning** — Current Reality Trees (CRT), Future Reality Trees (FRT), Prerequisite Trees, Transition Trees
- **Conflict structuring** — Evaporating Cloud (EC), Polarity-style tension mapping
- **Inference clarity** — Ladder of Inference, First Principles decomposition

If your model or skill doesn't fit one of these categories, it's probably not a fit for Esteem. When in doubt, open an issue first.

## What We Don't Want

- **Skills that duplicate model logic inline.** A skill that re-defines what a CLD link or polarity means belongs in `models/`, not in the skill. See *The two-layer rule* below.
- **Generative or divergent stances.** Esteem skills don't brainstorm or propose. They elicit, validate, and mirror. Generative work belongs in Libertee.
- **Drama without epistemic form.** A facilitation arc that has dramaturgy but no underlying model is just chat. Esteem skills always *invoke* a model.
- **Methods that require external tools, APIs, or code.** Esteem is purely declarative Markdown. Renderers and integrations live in separate, downstream tools.
- **Duplicate coverage.** If an existing model or skill already handles a use case well, improve it rather than adding a parallel one.

## The Two-Layer Rule

This is the central architectural rule and the main thing that makes Esteem Esteem. Read it carefully.

### Layer 1 — Models (`models/`)

Pure, domain-independent thinking structures. No facilitation, no dramaturgy. Versionable, referenceable, composable.

Each model lives in `models/<model>/` and contains at minimum:

- `<model>-logic.md` — the semantic foundation. What the elements *mean*. Well-formedness rules.
- `dsl.md` — the textual grammar (when the model has a DSL). What syntax counts as a valid instance.
- `archetypes/` (optional) — recurring patterns expressible in the model, each in its own file.

### Layer 2 — Skills (`skills/`)

Facilitation arcs that situationally combine models. Dramaturgy, transitions, navigation.

A skill **invokes** a model — it does not redefine it. If you find yourself copying CLD rules into a skill, stop. Extract them to `models/cld/` and reference them from the skill.

### Why the rule exists

- Models are reusable across many skills. A CLD is a CLD whether you build it via diagnostic, conflict-resolution, or future-design dialog.
- Skills can evolve their dramaturgy without dragging the canonical knowledge along.
- Contributors can improve a model without breaking every skill that uses it, and vice versa.

If a PR violates this rule, it will get reverted regardless of how well it works in isolation. The rule is load-bearing.

## How to Contribute

### Adding a new model

1. **Open an issue first** — describe the model, its sources, and why Esteem needs it.
2. Create `models/<model>/<model>-logic.md` — the semantic spec.
3. Create `models/<model>/dsl.md` — the textual grammar (if the model has one).
4. If the model has recurring patterns, create `models/<model>/archetypes/_index.md` and one file per archetype.
5. Add at least one example in `examples/` showing a realistic instance.

### Adding a new skill

1. **Open an issue first** — describe the skill, the user's situation it serves, and which existing model(s) it invokes.
2. Create `skills/<skill-name>/SKILL.md` — the orchestrator.
3. Create `skills/<skill-name>/agents/` if the skill spawns subagents. One file per role.
4. Reference model files; do not duplicate model rules inline.
5. Add an example session in `examples/`.

### Adding a new archetype to an existing model

1. Read the model's existing archetype files for the conventions (signature, generic structure, slots, recognition triggers, classic example).
2. Add `models/<model>/archetypes/<archetype-id>.md` following the same shape.
3. Append the entry to `models/<model>/archetypes/_index.md`.
4. Cite sources (e.g. *The Fifth Discipline*, Goldratt's TOC, etc.).

## File Templates

### Model file (`models/<model>/<model>-logic.md`)

```markdown
---
name: <model>-logic
description: "Semantics of <Model> — what its elements mean and when an instance is well-formed"
layer: 1
model: <model>
---

# <Model> — Model Logic

[1-2 paragraph framing — what the model makes visible, what kind of question it answers, where it's convergent.]

---

## <Element>
[Definition + small example + edge cases]

## Well-formedness
[Numbered list of validity rules]

## What this is *not*
[Disambiguation from neighboring models]
```

### DSL spec (`models/<model>/dsl.md`)

```markdown
---
name: <model>-dsl
description: "DSL grammar for <Model> — how to write an instance as a fenced ```<model> block"
layer: 1
model: <model>
version: 0.1
---

# <Model> DSL — v0.1

[Grammar, sections, examples, anti-examples, what's NOT in v0.1]
```

### Archetype file (`models/<model>/archetypes/<archetype-id>.md`)

```markdown
---
name: <archetype-id>
display-name: "<Display Name>"
description: "<one-liner signature>"
layer: 1
model: <model>
type: archetype
---

# <Display Name>

## Signature
[2-3 sentence pattern description]

## Generic structure
```<model>
[DSL block showing the canonical structure]
```

## Slots
[Table mapping slot names to what fills them in an instance]

## Recognition triggers
[Phrases or symptoms that suggest this archetype]

## Classic example
[A short, well-known instance]

## How it differs from neighbors
[Disambiguation from adjacent archetypes]

## Sources
[Citations]
```

### Skill file (`skills/<skill>/SKILL.md`)

```markdown
---
description: "<one-liner — appears in the skill picker>"
argument-hint: "[<arg description>] [--flags]"
allowed-tools: Read, Write, Edit
user-invocable: true
---

# <Skill Name> — Session Orchestrator

You are a **reasoning partner** for <task>. The cognitive work stays with the user.

## Language Behavior
[Detect language from input, respond in that language. Pass language to subagents.]

## Source Files (read at session start)
[Which model files the skill references — paths under models/]

## Session Flow
[Numbered steps: framing, file creation (if any), iterative co-creation, validation, close]

## Co-Creation Stance
[Slow down, user owns the model, plain language for technical questions, reflect-don't-lead]

## What you must NOT do
[Anti-patterns specific to this skill]
```

### Agent file (`skills/<skill>/agents/<role>.md`)

```markdown
---
name: <role>
description: "One-line role description"
model: sonnet
maxTurns: 3
---

# <Role> — One Voice in <Skill>

## Your Role
[What this agent does]

## What You Do
[3-5 bullets]

## What You Do NOT Do
[3-5 anti-bullets — equally important]

## Language Behavior
Respond in the same language as the context you receive.

## Output Format
[Structured template]
```

## Design Principles

1. **Convergent, not divergent.** Esteem narrows the answer space. If your contribution opens it, it belongs in Libertee.
2. **Cognitive load stays with the user.** The skill structures and asks; the user thinks. The agent doesn't propose answers when the user hasn't taken the question yet.
3. **Reasoning partner, not protagonist.** No advocacy, no debate, no taking-the-stage. Mirror, structure, check.
4. **Markdown is the source of truth.** Models, skills, agents, examples — all Markdown with YAML frontmatter. No build step, no source compilation.
5. **Two-layer separation is enforced.** Skills reference model files; they never duplicate model logic. See *The two-layer rule*.
6. **Runtime i18n.** Detect the user's language once from input, pass it explicitly to all spawned agents. No hardcoded strings.
7. **Plugin language is English.** All files in this repo — skills, agents, models, archetypes, README, examples — are written in English. Conversations between users and the agent at runtime can be any language.
8. **Structural tests, not content tests.** Tests verify file structure, frontmatter shape, and skill-flow contracts — not LLM output content. LLM variation is expected.

## Testing

Run any new or modified skill locally with:

```bash
claude --plugin-dir ./
```

For structural validation, check that:

- Skill files have valid YAML frontmatter with `description`, `argument-hint`, `allowed-tools`, `user-invocable`
- Agent files have valid YAML frontmatter with `name`, `description`, `model`, `maxTurns`
- Model files have valid YAML frontmatter with `name`, `description`, `layer`, `model`
- Skills referencing a model file actually point at an existing path under `models/`

## Examples

`examples/fixes-that-fail-session.md` is the canonical reference for what an example session should look like. Examples are real session transcripts (or close-to-real reconstructions), not synthetic best-case scripts. They demonstrate actual co-creation flow including hesitations, corrections, and the file-state at each step.

Add new examples in the same shape. One scenario per file. Name files `<archetype-or-skill>-session.md`.

## Attribution

Cite the sources of any model or archetype you contribute. Senge, Goldratt, Argyris, and Lipmanowicz/McCandless show up frequently — credit the origin in the model file itself, not just the README.

## Questions?

Open an issue — happy to discuss ideas before you invest time building them.
