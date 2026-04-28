---
name: cld-dsl
description: "DSL v0.1 grammar for Causal Loop Diagrams — how to write a CLD as a fenced ```cld block in markdown"
layer: 1
model: cld
version: 0.1
---

# CLD DSL — v0.1

A textual notation for Causal Loop Diagrams. Lives as a **fenced code block** with language tag `cld` inside any markdown file. Markdown is the source of truth — the surrounding prose holds context, the block holds the diagram.

```cld
# title: Sprint reliability
# status: draft
# created: 2026-04-28

variables:
  - sprint-velocity
  - team-overload
  - hire-more-people

links:
  team-overload   → sprint-velocity     [-]
  sprint-velocity → hire-more-people    [-]
  hire-more-people → team-overload      [+, delay:high]

loops:
  B1 [balancing]: sprint-velocity → hire-more-people → team-overload → sprint-velocity
```

---

## Sections

A `cld` block has up to four sections, in this order:

1. **Header comments** (optional) — `# key: value` lines. Conventional keys: `title`, `status`, `created`, `author`. Free-form, not validated.
2. **`variables:`** — a list of named quantities (one per line, leading `-`).
3. **`links:`** — directed edges with polarity and optional delay.
4. **`loops:`** — named loops with type and the variable cycle.
5. **`archetype:` / `instance:`** (optional) — when the CLD is an instance of a known archetype.

Sections that are not used may be omitted. `variables:` and `links:` are required; a CLD without at least one loop is technically valid syntax but logically incomplete — `cld-logic.md` calls that out.

---

## Variables

```
variables:
  - <name>
  - <name>
```

Names use `kebab-case`. They must be unique within the block. Use neutral nouns ("workload", not "overload").

---

## Links

```
links:
  <from> → <to>   [<polarity>]
  <from> → <to>   [<polarity>, delay:<level>]
```

- `<from>` and `<to>` reference variables declared in `variables:`
- The arrow can be `→` (preferred Unicode) or `->` (ASCII fallback). The parser MUST accept both.
- `<polarity>` is `+` or `−` (Unicode minus) or `-` (ASCII hyphen). Required.
- `delay:<level>` is optional. Levels: `none`, `low`, `high`. If omitted, treat as `none`.

**Whitespace inside the brackets is permissive** — `[+]`, `[ + ]`, `[+, delay:high]`, `[ +, delay : high ]` all parse.

---

## Loops

```
loops:
  <id> [<type>]: <var1> → <var2> → ... → <var1>
```

- `<id>` is a short identifier — convention: `R1`, `R2`, … for reinforcing, `B1`, `B2`, … for balancing
- `<type>` is `reinforcing` or `balancing`
- The cycle must close (last variable = first variable)
- All variables in the cycle must be declared in `variables:`, and every consecutive pair must be connected by a link in `links:`
- The declared `<type>` MUST be consistent with the polarity rule (even number of `−` links → reinforcing; odd → balancing). A linter SHOULD flag mismatches.

---

## Archetype reference (optional)

When a CLD instantiates a known archetype, add at the bottom:

```
archetype: <archetype-id>
instance: <human-name>
  map:
    <archetype-slot> → <concrete-variable>
    <archetype-slot> → <concrete-variable>
```

- `<archetype-id>` matches a file in `models/cld/archetypes/<id>.md`
- `<archetype-slot>` is one of the generic variable names defined in that archetype
- `<concrete-variable>` is one of the variables declared in this CLD's `variables:` section

Example:

```cld
archetype: fixes-that-fail
instance: hiring-treadmill
  map:
    problem-symptom        → team-overload
    quick-fix              → hire-more-people
    unintended-consequence → onboarding-burden
```

---

## What is NOT in v0.1

The following are explicitly out of scope for the first DSL version. They will be added when there is concrete pressure for them:

- **Layout hints** — node positions, loop directions, emphasis. The DSL today says *what* the CLD is, not *how* to draw it. A renderer is not part of v1.
- **Quantification** — initial values, rates, equations. CLDs are not System Dynamics models.
- **Conditional links** — links that depend on a third variable's state.
- **Sub-models / composition** — referencing one CLD from another.

---

## File-level convention

When a CLD lives in its own file, use the suffix **`.cld.md`**. The file is markdown — frontmatter on top, prose for context, one or more `cld` fenced blocks for the diagram(s). One canonical CLD per file is the default; multiple blocks are allowed for showing iteration history.

A minimal `.cld.md` skeleton:

````markdown
---
title: <human title>
status: draft
created: 2026-04-28
---

# <human title>

<one paragraph of context — what situation is this CLD about?>

```cld
variables:
  - …

links:
  …

loops:
  …
```
````
