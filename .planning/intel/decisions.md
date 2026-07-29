# Decisions (Layer: ADR)

Extracted from ADR-classified documents in the ingest set.
Repo root: `C:/Users/Thomy/Documents/projects/2026-04 esteem` — `source:` paths are repo-relative.

**Ingest-set note:** exactly one ADR was classified. Its header reads
`Status: direction agreed, nothing implemented yet` — not `Accepted` — so every
decision below is recorded as `proposed`, not `locked`. These describe an agreed
*target* state; the DOC-sourced material in `context.md` describes the *current*
state. See `INGEST-CONFLICTS.md` INFO section for the temporal split.

---

## ADR-D1: The CLD DSL becomes pure YAML
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- status: proposed
- decision: The DSL becomes pure YAML. The v0.1 format is YAML-shaped but not YAML — measured against PyYAML, `links:` parses successfully into a single folded string (polarity, arrow and delay collapse into text), `loops:` parses as a map by accident, and `archetype:`/`instance:`/`map:` are hard parse errors. The silent-success of `links:` is the decisive failure mode: a downstream tool reaching for `yaml.safe_load()` gets a plausible-looking dict in which half the semantics has become a string. Stated priority for this decision: interoperability and agent authoring over human readability.
- scope: CLD DSL, YAML format, models/cld/dsl.md, downstream parser consumers

## ADR-D2: Polarity is spelled out as `same` / `opposite`
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- status: proposed
- decision: Polarity values become `same` / `opposite`. `polarity: -` is a hard YAML parse error while `polarity: +` parses fine as the string `'+'` — the two values fail asymmetrically and invisibly at authoring time, which is fatal for agent-authored files. `same`/`opposite` is chosen over `positive`/`negative` on three grounds: `cld-logic.md` already glosses polarity as "same direction"/"opposite direction"; all twelve archetypes cite Senge and Kim (the S/O tradition), not Sterman; and `negative` invites the moral-valence misreading `cld-logic.md` explicitly warns against.
- scope: CLD DSL polarity notation, models/cld/dsl.md, models/cld/cld-logic.md, twelve archetype files

## ADR-D3: Loop paths are YAML lists, not arrow strings
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- status: proposed
- decision: Loop paths are YAML lists (`path: [a, b, c]`), not arrow scalars (`a -> b -> c`). Keeping DWSD's arrow scalar for family consistency was considered and rejected: six of six malformed arrow paths (space in arrow, Unicode arrow, `->>` typo, truncated, arrows omitted) pass YAML silently, whereas the list form turns the same error classes into hard parse errors or catches them via the existing undeclared-variable check. Further reasons: arrow ambiguity would have to be re-implemented in every parser forever, whitespace normalisation becomes manual, and a YAML parser yields a node range per list item so diagnostics can underline the exact offending variable. Not inconsistent with DWSD, whose arrows are *typed* and carry edge meaning; a CLD loop arrow carries nothing because polarity and delay are already declared in `links:`.
- scope: CLD DSL loops section, models/cld/dsl.md, diagnostics ranges

## ADR-D4: `loops:` is a record, not an authoring surface
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- status: proposed
- decision: Loops are derivable — given `links:`, cycle detection finds every cycle and the polarity rule computes each one's type (verified against the hiring-treadmill example: B1 balancing, R1 reinforcing, both matching the asserted IDs). What `loops:` genuinely adds is which cycles are worth telling, what they are called, and what they mean. Resulting shape carries `id`, `label`, `path`. Implicit closure — the path names the cycle once, the last element links back to the first; a 2-cycle is two entries, not three. Type is derived, not authored: the ID carries the assertion (`B1` claims balancing) and derivation confirms or contradicts it, and a contradiction is the point ("you call this B1, but the polarities make it reinforcing") — the Validator role. An explicit `type:` may remain optional: checked when present, derived when absent. `label:` carries the only genuinely non-derivable information. Rejected alternatives: link IDs referenced from loops (every link needs an ID most will never use; a wrong `L7` is far harder to spot than a wrong variable name) and adjacency notation for links (exposes the full Norway problem, loses ordering, lets some parsers silently drop duplicate keys).
- scope: CLD DSL loops section, cycle detection, loop-type derivation, models/cld/cld-logic.md well-formedness rules, Validator role

## ADR-D5: Open state needs no notation; near-miss is a facilitation primitive
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- status: proposed
- decision: Closure must not be enforced syntactically. A CLD is built in dialog; loops are open for most of a session and closing is a discovery event. An earlier proposal to make non-closing loops unrepresentable was wrong — it makes the working state of an actual session unwritable and contradicts the already-locked tolerance decision in the sibling repo (Phase 2, SC-5, from spike 007: a partial DSL produces a valid `{ast, diagnostics}` tuple, never throws). The open state is already representable — it is `links:`. A session with eight links and no `loops:` entry is valid YAML and a valid partial model; `loops:` entries appear when a cycle closes and the group names it. Two derived queries serve facilitation: closed cycles (what just closed, and of which type) and near miss (which single edge would close a cycle). The tool does not assert the edge exists — it says *if* this edge existed, a cycle would close; whether the causality is real is the group's call. That is the reasoning-partner stance, and the same rule as "refuse to invent variables the user did not mention" applied to links.
- scope: CLD DSL open/partial state, cycle detection, near-miss query, skills/cld-build dramaturgy (step 3), preview/AST shape, tolerant diagnostics

## ADR-D6: Separate the mechanical layer from the didactic layer
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- status: proposed
- decision: Adopt DWSD's Skill (mechanical: read and author the DSL) vs Play (didactically built sequence for working with a group) distinction. Esteem already has it by half: `cld-teach` is a pure Play (no file output); `cld-build` is a Play with a Skill baked in. Everything in D4 and D5 — cycle detection, near miss, type derivation, closure status, tolerant diagnostics — is Skill material. Esteem's Skill layer must be scoped more narrowly than DWSD's: DWSD does NL→DSL because a board is a *descriptive* artifact, but a CLD is an *epistemic claim* — a `cld-author` that generates a finished CLD from a description is precisely what CONTRIBUTING.md lists under *What We Don't Want*. Esteem's Skill layer is therefore read, validate, derive, write-what-was-confirmed — not generate. Esteem does not need DWSD's `cards/` because `models/` already exists; the identified gap is the mechanical `SKILL.md`. Because the Skill/Play boundary carries less weight here (for DWSD it is also a distribution boundary for gated proprietary Plays; Esteem is MIT and public), the response is proportionate: a convention inside `skills/` — naming, frontmatter, shared reference files — not a separate architecture. Remaining motivation is reuse: the mechanics are identical across CLD, CRT, FRT and EC and would otherwise be written seven times and drift apart. One consideration points the other way: if DWSD Plays are served from a gated server, one could consume Esteem's mechanics rather than duplicate them, making the mechanical layer a documented, stable interface for an external consumer.
- scope: skills/ layer convention, skills/cld-build, skills/cld-teach, mechanical vs didactic split, cross-model reuse (CLD/CRT/FRT/EC), external consumer interface
