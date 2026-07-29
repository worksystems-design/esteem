# Context (Layer: DOC)

Running notes keyed by topic, extracted from DOC-classified documents plus
non-decision material from the ADR. Repo root:
`C:/Users/Thomy/Documents/projects/2026-04 esteem` — `source:` paths are repo-relative.

---

## Project identity and positioning
- source: README.md, CLAUDE.md, CONTRIBUTING.md
- A Claude Code plugin for Systems Thinking support — explains canonical thinking models and helps you build them "with you, not for you".
- Convergent counterpart to Libertee (`https://github.com/worksystems-design/libertee`). Libertee opens the space (perspectives, scenarios, what-ifs); Esteem closes it (structure, validation, causality). Both sit under the **DWSD** umbrella for structured thinking.
- Core distinction table (CLAUDE.md): direction divergent vs convergent; agent role Protagonist vs Reasoning-Partner; cognitive load on agent vs on user; input minimal seed vs context-rich dialog; output perspectives/scenarios vs structure/validation.
- "The agent **structures, checks, mirrors** — it does not generate the thinking."
- Author: Thomas Krause — worksystems.design. Licence MIT.

## Project status — conflicting statements
- source: README.md, CLAUDE.md
- README.md: "Status: **early v0.1** — first model (Causal Loop Diagrams) and first archetype (Fixes that Fail) shipped end-to-end. More models and archetypes to come."
- CLAUDE.md: "Status: Konzeptphase. Reference planning: `../202604 esteem marketing/origin/esteem-planning.md`."
- These disagree. See `INGEST-CONFLICTS.md` (INFO: status supersession; WARNING: skill-taxonomy divergence). The ADR corroborates README by referring to `skills/cld-build/SKILL.md`, `skills/cld-teach`, `models/cld/dsl.md`, twelve archetype structure blocks, an example transcript, `plugin.json` at `0.1.0`, and a landed commit `f4e870e` — all consistent with shipped v0.1.

## Two-layer architecture
- source: CLAUDE.md, CONTRIBUTING.md, README.md
- **Layer 1 — Models (`models/`)**: stable, domain-independent thinking structures. No facilitation, no dramaturgy. Pure epistemic form — versionable, referenceable, composable. The DSL grammar; the semantics of variables, links, loops; the catalog of archetypes.
- **Layer 2 — Facilitation Skills (`skills/`)**: thinking arcs that situationally combine models. Dramaturgy, transitions, navigation. A skill invokes a model; it does not redefine it.
- Rationale (CONTRIBUTING.md): models are reusable across many skills — "a CLD is a CLD whether you build it via diagnostic, conflict-resolution, or future-design dialog"; skills can evolve dramaturgy without dragging canonical knowledge along; contributors can improve a model without breaking every skill that uses it, and vice versa.
- Each model lives in `models/<model>/` and contains at minimum `<model>-logic.md` (semantic foundation, well-formedness rules), `dsl.md` (textual grammar, when the model has a DSL), and optionally `archetypes/` (one file per pattern).
- Binding-rule form of this is recorded in `constraints.md`.

## Three agent roles (situational)
- source: CLAUDE.md
- **Elicitor** — asks, structures spoken language into the tool (CRT, EC, Ladder).
- **Validator** — checks the logic of a finished structure (CRT verification, FRT).
- **Pattern Matcher** — recognizes archetype patterns from situation descriptions (CLD entry).
- "Pick the role per facilitation skill — don't blend."
- Cross-reference: ADR-D4 explicitly invokes the Validator role for loop-type derivation ("you call this B1, but the polarities make it reinforcing"). README's roadmap maps v0.2 to Pattern Matcher and v0.3 to Validator.

## Model coverage — domains in scope
- source: CONTRIBUTING.md, CLAUDE.md
- Causal modeling — Causal Loop Diagrams (CLDs), archetypes, system dynamics structures.
- Logical reasoning — Current Reality Trees (CRT), Future Reality Trees (FRT), Prerequisite Trees (PRT), Transition Trees (TrT).
- Conflict structuring — Evaporating Cloud (EC), Polarity-style tension mapping.
- Inference clarity — Ladder of Inference, First Principles decomposition.
- "If your model or skill doesn't fit one of these categories, it's probably not a fit for Esteem. When in doubt, open an issue first."
- Note: CONTRIBUTING lists First Principles as in-scope while CLAUDE.md lists its ownership as an open decision — see `INGEST-CONFLICTS.md` WARNING.

## Shipped skills (v0.1)
- source: README.md
- `/esteem:cld-teach` — teach Causal Loop Diagrams or a specific archetype, in conversation. No file output. Args: none (default: basics of CLDs), `basics`, `archetypes` (explain what archetypes are, show the index), or any of the twelve archetype IDs (e.g. `fixes-that-fail`, `limits-to-growth`).
- `/esteem:cld-build` — co-create a CLD with the user. Produces a `.cld.md` file in the current directory, written turn by turn through focused questions. Optionally suggests a matching archetype at the end. Args: none (asks for the situation), a short framing string, `--no-archetype` to skip the archetype-match step.

## CLD — what the model does
- source: README.md
- "A CLD makes circular causality in a system visible: which quantities act on which, in which direction, with what delay — and which effects close into loops."
- Full grammar in `models/cld/dsl.md`; semantics in `models/cld/cld-logic.md`.

## Current DSL form (v0.1, as documented today)
- source: README.md
- The README example uses Unicode arrows, bracketed `[+]` / `[-]` polarity with `delay:high`, and a `loops:` section written as `B1 [balancing]: a → b → a` with explicit closure (first element repeated last).
- CLAUDE.md documents the fence namespace `esteem.cld` / `esteem.crt` / `esteem.frt` / `esteem.ec`.
- **This is the pre-migration state.** ADR-D1..D5 replace the `links:` and `loops:` forms; the fence tag and the `.cld.md` suffix are explicitly unaffected. See `INGEST-CONFLICTS.md` INFO on the temporal split.

## Archetype catalog
- source: README.md
- Twelve canonical Systems Thinking archetypes catalogued in `models/cld/archetypes/`, with `_index.md` as the lookup table: 1. Balancing Process with Delay, 2. Limits to Growth, 3. Shifting the Burden, 4. Shifting the Burden to the Intervenor, 5. Eroding Goals, 6. Escalation, 7. Success to the Successful, 8. Tragedy of the Commons, 9. **Fixes that Fail** (full reference example), 10. Growth and Underinvestment, 11. Accidental Adversaries, 12. Rule Beating.
- Each archetype file lists its signature, generic structure as a CLD-DSL block, slots, recognition triggers, and a classic example.
- ADR migration impact: "twelve archetype structure blocks" require rewrites, not search-and-replace.

## Roadmap (README-declared)
- source: README.md
- **v0.2 — Pattern Matcher**: new skill `/esteem:cld-detect` — recognize an archetype from a situation description, without first building a CLD.
- **v0.3 — Validator**: new skill `/esteem:cld-validate <file>` — check an existing `.cld.md` for well-formedness and loop-type consistency.
- **v0.4+ — More models**: Current Reality Tree (CRT), Future Reality Tree (FRT), Evaporating Cloud (EC), Ladder of Inference, First Principles Decomposition (subject to scope split with Libertee), Prerequisite Tree (PRT) and Transition Tree (TrT).
- **Later**: session-recorder skill or hook (separate from build skills) to capture reasoning history; VSCode-side preview of `.cld.md` (separate project, not part of this plugin).
- **Not on this roadmap:** the DSL migration from ADR-D1..D6. See `INGEST-CONFLICTS.md` WARNINGs on version collision and migration timing.

## Installation and layout
- source: README.md
- From GitHub: `/plugin marketplace add worksystems-design/esteem` then `/plugin install esteem@worksystems-design-esteem`; restart Claude Code. Local: `git clone https://github.com/worksystems-design/esteem.git` then `claude --plugin-dir ./esteem`. Uninstall: `/plugin uninstall esteem@worksystems-design-esteem`.
- README plugin layout (describes shipped state): `.claude-plugin/` (plugin.json, marketplace.json); `models/cld/` with `cld-logic.md` (semantics), `dsl.md` (DSL grammar v0.1), `archetypes/` (`_index.md`, `fixes-that-fail.md` full reference, eleven more); `skills/cld-teach/SKILL.md`; `skills/cld-build/SKILL.md` plus `agents/elicitor.md`; `examples/`; `README.md`; `CLAUDE.md`.
- CLAUDE.md "Repo Structure (planned)" differs — it lists `models/` with `crt/ frt/ ec/ ladder-of-inference/ first-principles/ prt/ trt/`, `skills/` as `diagnostic-arc/ conflict-resolution/ future-design/ shared/`, plus an `assets/` directory, and shows `models/cld/` without `dsl.md`. Both mirror Libertee's plugin layout but add the dedicated `models/` tree. See `INGEST-CONFLICTS.md` WARNING on the skill taxonomy.

## Contribution process
- source: CONTRIBUTING.md
- **New model**: open an issue first (model, sources, why Esteem needs it) → `models/<model>/<model>-logic.md` → `models/<model>/dsl.md` (if it has one) → `models/<model>/archetypes/_index.md` plus one file per archetype (if it has recurring patterns) → at least one realistic example in `examples/`.
- **New skill**: open an issue first (skill, the user situation it serves, which models it invokes) → `skills/<skill-name>/SKILL.md` (orchestrator) → `skills/<skill-name>/agents/` one file per role if it spawns subagents → reference model files, do not duplicate rules → example session in `examples/`.
- **New archetype**: read existing archetype files for conventions → add `models/<model>/archetypes/<archetype-id>.md` in the same shape → append to `_index.md` → cite sources.
- **Explicitly unwanted**: skills duplicating model logic inline; generative or divergent stances; drama without epistemic form; methods requiring external tools/APIs/code; duplicate coverage of an existing model or skill.

## File templates
- source: CONTRIBUTING.md
- Model file frontmatter: `name`, `description`, `layer: 1`, `model`. Body: framing paragraph, per-element definitions, well-formedness rules, "What this is *not*" disambiguation.
- DSL spec frontmatter: `name: <model>-dsl`, `description`, `layer: 1`, `model`, `version: 0.1`. Body: grammar, sections, examples, anti-examples, what's NOT in v0.1. Description text references the fenced ` ```esteem.<model> ` block form.
- Archetype file frontmatter: `name`, `display-name`, `description` (one-liner signature), `layer: 1`, `model`, `type: archetype`. Body: Signature, Generic structure (DSL block), Slots, Recognition triggers, Classic example, How it differs from neighbors, Sources.
- Skill file frontmatter: `description`, `argument-hint`, `allowed-tools: Read, Write, Edit`, `user-invocable: true`. Body: reasoning-partner framing, Language Behavior, Source Files (read at session start), Session Flow, Co-Creation Stance, What you must NOT do.
- Agent file frontmatter: `name`, `description`, `model: sonnet`, `maxTurns: 3`. Body: Your Role, What You Do, What You Do NOT Do, Language Behavior, Output Format.

## Testing conventions
- source: CONTRIBUTING.md
- Run any new or modified skill locally with `claude --plugin-dir ./`.
- Structural validation checks frontmatter shape per file class and that skills referencing a model file point at an existing path under `models/`. Detail in `constraints.md`.

## Examples convention
- source: CONTRIBUTING.md, README.md
- `examples/fixes-that-fail-session.md` is the canonical reference — a full transcript of `/esteem:cld-build` constructing a Fixes-that-Fail instance.
- "Examples are real session transcripts (or close-to-real reconstructions), not synthetic best-case scripts. They demonstrate actual co-creation flow including hesitations, corrections, and the file-state at each step." One scenario per file; name files `<archetype-or-skill>-session.md`.
- ADR migration impact: the example transcript needs rewriting.

## Open decisions (CLAUDE.md-declared)
- source: CLAUDE.md — section header reads "Open Decisions (do not lock without discussion)"
- ESTEEM acronym (EEM letters unresolved).
- DSL syntax family: YAML-style vs. code-style. → **Superseded by ADR-D1** (pure YAML). See `INGEST-CONFLICTS.md` INFO.
- Render target for diagrams: D3 vs. own SVG renderer (relevant later for any VSCode-side preview).
- Whether First Principles lives in Esteem or stays in Libertee. → contested, see `INGEST-CONFLICTS.md` WARNING.
- First archetype to implement end-to-end ("Fixes that Fail" is the candidate). → **resolved in fact** by README (shipped end-to-end). See `INGEST-CONFLICTS.md` INFO.
- "See planning doc for full list" — `../202604 esteem marketing/origin/esteem-planning.md`, described in CLAUDE.md as "the canonical source until we move it". **This planning doc is outside the ingest set and was not read.**

## Open questions (ADR-declared)
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- **Where does an Esteem Play end and a DWSD Play begin?** Provisional answer (2026-07-29): the group-facilitation scenario — AI as facilitator, group present, visualisation, "can we close now?" — is an **Esteem** Play. Marked provisional; revisit when the DWSD Play layer becomes concrete.
- **Version number.** `plugin.json` is at `0.1.0`. The fence-tag change is already breaking, and the YAML migration much more so. `0.2.0` collides with the README roadmap, which assigns v0.2 to the Pattern Matcher (`cld-detect`). Undecided: `0.1.x`, renumber the roadmap, or bump only with the next feature.
- **Migration timing.** Own milestone, or folded into the next one?

## Migration impact (ADR-declared)
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- **This repo** — rewrites, not search-and-replace: `dsl.md`, the polarity rule in `cld-logic.md`, twelve archetype structure blocks, the example transcript, and `cld-build/SKILL.md` — where the *writing strategy* also changes, because appending to a YAML list differs from appending a line.
- **`esteem-dsl-vscode`** — the expensive part. `lexer.ts` / `parser.ts` / `tokens.ts` / `recovery.ts` largely become obsolete, replaced by a YAML parser plus a semantic validation layer. That collides with the core's `deps: {}` (the framework-free constraint itself survives — a pure-JS YAML library imports nothing from node or vscode). Diagnostics must be rehung on the YAML parser's ranges. Large parts of 145 + 50 tests, and 33 spike fixtures, need redoing. The TextMate grammars get *simpler* — they could delegate to `source.yaml`. Phase 4 (renderer) is largely unaffected; it consumes the AST.
- **Timing argument** — "The extension is unpublished and the plugin has effectively no users. This is the cheapest this decision will ever be."
- **Unaffected** — the `esteem.cld` fence tag survives the migration unchanged (DWSD does the same, with `dwsd.board` fences containing YAML; the tag says "this is YAML, and specifically a CLD"). The `.cld.md` suffix is also unaffected; it names the markdown container, not the block.

## Triggering context for the ADR
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- Two findings triggered the design session. First: the fence tag in this repo (` ```cld `) did not match what the VSCode extension's TextMate grammar injects on (` ```esteem.cld `), so a `.cld.md` produced by `/esteem:cld-build` got no highlighting, diagnostics, or preview. **That is fixed** (commit `f4e870e`) — and CLAUDE.md now documents the `esteem.` namespace as binding.
- Second, and larger: investigating that surfaced the question of whether the DSL is actually YAML. It is not, "and the way it fails is the problem."
- The note explicitly states its own purpose: "This note records a design session. The DSL on disk is still v0.1 and unchanged; everything below is the agreed direction for the next revision. It exists so the reasoning survives the gap between sessions."

## Cross-repo relationships
- source: CLAUDE.md, docs/design-notes/2026-07-29-dsl-direction-and-layering.md, README.md
- **`esteem-dsl-vscode`** (`../2026-04 esteem-dsl-vscode`) — sibling repo holding the VSCode extension: TextMate grammars, lexer/parser, diagnostics, renderer. Consumes `models/cld/dsl.md` via SHA-256-pinned mirror. Unpublished. Has its own phase plan (Phase 2 SC-5 tolerance decision is locked; Phase 4 is the renderer; Phase 5+ would carry near-miss ghost arrows).
- **Libertee** (`https://github.com/worksystems-design/libertee`) — divergent sibling, referenced as the technical pattern for plugin layout. CLAUDE.md: "Reference Libertee freely as the technical pattern, but flag every place where Esteem must diverge (two-layer separation, reasoning-partner stance)."
- **DWSD** — umbrella. Source of the pure-YAML DSL precedent (all 22 bundled examples parse cleanly; already migrated away from inline sugar), the Skill/Play distinction, and the `dwsd.board` fence-containing-YAML pattern. DWSD has no model layer — its `cards/` fuse knowledge with mechanical skill, which Esteem does not need because `models/` exists.
- **`../202604 esteem marketing/origin/esteem-planning.md`** — described by CLAUDE.md as canonical planning source "until we move it". Not in the ingest set.
