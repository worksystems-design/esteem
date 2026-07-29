# Esteem

## What This Is

A Claude Code plugin for Systems Thinking support. It explains canonical thinking models — Causal Loop Diagrams and the twelve archetypes today; Current Reality Trees, Future Reality Trees, Evaporating Cloud, Ladder of Inference and the TOC trees later — and helps people build them in dialog: with them, not for them. Esteem is the convergent sibling to Libertee under the DWSD umbrella (Libertee opens the space, Esteem closes it). MIT, public at `github.com/worksystems-design/esteem`.

## Core Value

The agent structures, checks and mirrors the user's thinking — it never generates the thinking. Everything else can fail; that stance cannot.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ CLD model layer shipped end-to-end — `models/cld/cld-logic.md`, `models/cld/dsl.md` (v0.1), twelve archetype files plus `_index.md`
- ✓ `/esteem:cld-teach` — teaches CLD basics, the archetype set, or a single archetype, no file output
- ✓ `/esteem:cld-build` — co-creates a `.cld.md` turn by turn, with an optional archetype match at the end
- ✓ `examples/fixes-that-fail-session.md` — the canonical full-session reference transcript
- ✓ Fence namespace fixed to `esteem.<model>` so a produced `.cld.md` is recognized by the sibling VSCode extension (commit `f4e870e`)

### Active

<!-- Current milestone: DSL Migration to Pure YAML. Full, checkable list in REQUIREMENTS.md. -->

- [ ] The CLD DSL becomes pure YAML — no section silently folds into a string when a downstream tool calls `yaml.safe_load()`
- [ ] Polarity is spelled `same` / `opposite`; loop paths are YAML lists with implicit closure
- [ ] `loops:` becomes a record (`id`, `label`, `path`) — loop type is derived, not authored
- [ ] Every authored CLD in the repo — twelve archetype blocks, the example transcript, the README examples — is in the new format
- [ ] `/esteem:cld-build` writes the new format and reports closed cycles and near misses instead of asking "do you see a loop here?"
- [ ] The mechanical operations are written once in a shared reference under `skills/`, referenced rather than restated
- [ ] The sibling repo `esteem-dsl-vscode` consumes the new spec, its CI is green, and a freshly built `.cld.md` renders in its preview
- [ ] `CHANGELOG.md` exists, the two-clock versioning convention is written down, and README and CLAUDE.md stop contradicting the repo

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- **Executable code in this repo** (parser, renderer, cycle-detection engine, path-length cap as running code) — CONTRIBUTING Design Principle 4: purely declarative Markdown, no build step. All of it lives in the sibling repo `esteem-dsl-vscode`, which CONTRIBUTING explicitly permits as a downstream tool. Inside Esteem, cycle detection and near-miss derivation are Markdown instructions the agent performs at runtime.
- **Test suites, CI, code review in this repo** — ~2,400 lines of Markdown with no source code. Structural checks are run by hand (`claude --plugin-dir ./`) per CONTRIBUTING Design Principle 8; the sibling repo owns the automated testing.
- **A generative `cld-author`** that writes a finished CLD from a description — a CLD is an epistemic claim, not a descriptive artifact. This is precisely what CONTRIBUTING lists under *What We Don't Want*, and it is Libertee's half of the split.
- **Diagram rendering and preview** — separate project (`esteem-dsl-vscode`), not part of this plugin.
- **Version numbers attached to milestones** — see Key Decisions. Numbers come into existence at release/tag time from what actually shipped.
- **Migrating `.transient/` sketches** — gitignored personal working files, not part of the repo's contract.

## Context

**Where the project stands.** v0.1 shipped: one model (CLD), twelve archetypes, two skills, one reference session. Nothing has ever been released — no git tags, no GitHub releases, no `CHANGELOG.md`. The plugin has effectively no users and the sibling VSCode extension is unpublished. The ADR states the consequence plainly: *"This is the cheapest this decision will ever be."*

**Why the DSL migration is first.** The v0.1 format is YAML-*shaped* but not YAML. Measured against PyYAML: `variables:` parses correctly, `links:` parses **successfully into a single folded string** (polarity, arrow and delay collapse into text), `loops:` parses as a map by accident, and `archetype:`/`instance:`/`map:` are hard parse errors. The `links:` behavior is the dangerous one — it does not fail. Any new model or skill built against v0.1 would have to be rewritten immediately afterward.

**Two repos, one spec.** `models/cld/dsl.md` is the single source of truth for the DSL grammar and is mirrored into `../2026-04 esteem-dsl-vscode/docs/dsl.md`, pinned by SHA-256. The two repos must stay side by side in the same parent directory — `sync-spec.sh` resolves the source via the relative path `../2026-04 esteem/models/cld/dsl.md`.

**What comes after the migration.** CRT (Current Reality Tree) and FRT (Future Reality Tree) — ahead of the Pattern Matcher (`/esteem:cld-detect`) and Validator (`/esteem:cld-validate`) that the old README roadmap listed first. The driver is a workshop at the end of September 2026 in which Thomas intends to use CLDs, CRTs and FRTs. **That workshop is not yet binding** — end of September is a directional target, not a deadline, and no dates appear in the roadmap. How deeply CRT and FRT get built (full facilitation skills vs. model layer only) is deliberately left to plan-phase.

**Sibling and umbrella.** Libertee (`github.com/worksystems-design/libertee`) is the divergent counterpart and the reference pattern for plugin layout — but Esteem must diverge on two-layer separation and the reasoning-partner stance. DWSD is the umbrella and the source of the pure-YAML precedent (all 22 bundled examples parse cleanly; already migrated away from inline sugar), the Skill/Play distinction, and the `dwsd.board` fence-containing-YAML pattern.

## Constraints

- **Architecture**: Two-layer separation — `models/` (Layer 1, no facilitation) vs `skills/` (Layer 2, invokes models, never redefines them). CONTRIBUTING states the enforcement: *"If a PR violates this rule, it will get reverted regardless of how well it works in isolation. The rule is load-bearing."*
- **Dependencies**: `models/cld/dsl.md` is SHA-256 pinned into `../2026-04 esteem-dsl-vscode/docs/dsl.md`. Any change breaks that repo's CI until `pnpm sync-spec` is run there and the new pin committed. Both repos must stay side by side in the same parent directory.
- **External (locked elsewhere)**: sibling repo Phase 2, SC-5, from spike 007 — *"a partial DSL produces a valid `{ast, diagnostics}` tuple — never throws."* Locked outside this repo; cannot be renegotiated from here. ADR-D5 is shaped to honor it.
- **Tech stack**: Purely declarative Markdown with YAML frontmatter. No build step, no source compilation, no external tools or APIs.
- **Protocol**: DSL fence tags are always `esteem.<model>` — never the bare model name. The `.cld.md` suffix names the markdown container, not the block. Both survive the migration unchanged.
- **Stance**: Convergent only. Esteem skills elicit, validate and mirror — they do not brainstorm, propose, advocate or debate. Cognitive load stays with the user.
- **Compatibility**: Must work in both local Claude Code and Claude Cowork. Artifacts are single-file — no folder structures, no sidecars.
- **Language**: All repo files in English. Runtime conversation in the user's detected language — detect once, pass explicitly to subagents, no hardcoded strings. Variable names stay `kebab-case` and language-neutral within one CLD.
- **Schema**: Frontmatter shape per file class — skill files (`description`, `argument-hint`, `allowed-tools`, `user-invocable: true`); agent files (`name`, `description`, `model: sonnet`, `maxTurns` 3–5); model files (`name`, `description`, `layer`, `model`). Skills referencing a model must point at an existing path under `models/`.
- **Performance**: Cycle enumeration is exponential in a dense graph. The prototype capped path length at 8. Real CLDs (under ~15 variables) are fine, but any enumeration instruction needs a stated limit.
- **Attribution**: Cite sources on models and archetypes in the model file itself — Senge, Goldratt, Argyris, Kim, Lipmanowicz/McCandless. Trademark notice in README disclaims affiliation.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| The CLD DSL becomes pure YAML (ADR-D1) | `links:` fails silently into a folded string; a downstream tool calling `yaml.safe_load()` gets a plausible dict with half the semantics gone. Interoperability and agent authoring over human readability | — Pending (agreed, reversible) |
| Polarity is `same` / `opposite` (ADR-D2) | `polarity: -` is a hard parse error while `polarity: +` parses as `'+'` — asymmetric, invisible failure. `same`/`opposite` matches the Senge/Kim tradition all twelve archetypes cite, and avoids the moral-valence misreading `cld-logic.md` warns against | — Pending (agreed, reversible) |
| Loop paths are YAML lists, not arrow strings (ADR-D3) | Six of six malformed arrow paths pass YAML silently; the list form turns them into hard parse errors or catches them via the undeclared-variable check. A CLD loop arrow carries no meaning — polarity and delay are already in `links:` | — Pending (agreed, reversible) |
| `loops:` is a record, not an authoring surface (ADR-D4) | Loops are derivable from `links:`. What `loops:` adds is which cycles are worth telling, what they are called, what they mean. Type is derived; a contradiction with the `B1`/`R1` assertion is the point, not an error — that is the Validator role | — Pending (agreed, reversible) |
| Closure is never enforced syntactically; near miss is a facilitation primitive (ADR-D5) | A CLD is built in dialog; loops are open for most of a session. The open state is already representable — it is `links:`. Honors the sibling repo's locked tolerance decision | — Pending (agreed, reversible) |
| Mechanical layer separated from didactic layer (ADR-D6) | The mechanics are identical across CLD, CRT, FRT and EC; baked into each build skill they would be written seven times and drift apart. Scoped as a convention inside `skills/` — naming, frontmatter, shared reference files — because unlike DWSD there is no gated-distribution boundary here | — Pending (agreed, reversible) |
| The mechanical layer stays declarative Markdown in this repo | CONTRIBUTING Design Principle 4. All executable code lives in the sibling repo, which CONTRIBUTING permits as a downstream tool. Resolves the ingest WARNING on implementation locus — there is no fork; the synthesizer conflated two repos | ✓ Good |
| Two versioning clocks, no version numbers on milestones | `.claude-plugin/plugin.json` versions the plugin; each `models/<model>/dsl.md` frontmatter `version:` versions that model's format independently — that is what the sibling repo consumes. Milestones are named themes; numbers are assigned at release/tag time from what shipped. Retires the README's v0.2/v0.3/v0.4+ numbering and dissolves the ingest WARNING on the version collision | ✓ Good |
| The DSL migration is its own milestone, and it runs first | Any new model or skill built against the v0.1 format would have to be rewritten immediately afterward. Resolves the ingest WARNING on migration timing | ✓ Good |
| CRT and FRT come next, ahead of Pattern Matcher and Validator | A workshop at the end of September 2026 in which CLDs, CRTs and FRTs are all intended. Directional, not binding — no dates in the roadmap | ✓ Good |
| Ingest cross-ref cycle downgraded from BLOCKER to WARNING, accepted | `CLAUDE.md ↔ README.md` are bare filenames inside repo-layout code blocks — not hyperlinks, no authority claim, no content dependency. Enforcing the rule literally would have dropped 2 of 4 docs over two directory listings | ✓ Good |
| ADR decisions are agreed direction, not locked | The ADR header reads *"direction agreed, nothing implemented yet"* — not `Accepted`. All six are reversible if implementation surfaces a reason | — Pending |

## Open Questions

Recorded as open. Do not answer these by inference — they need a decision.

1. **Skill taxonomy.** Is CLAUDE.md's planned `diagnostic-arc/ conflict-resolution/ future-design/ shared/` tree retired in favor of per-model `cld-*` skills, or still intended as a later organizing layer? CLAUDE.md keeps re-asserting it; README and the ADR describe only `cld-teach` and `cld-build`. This decides where the shared mechanical reference lands in Phase 3.
2. **First Principles ownership — Esteem or Libertee?** CONTRIBUTING lists it in-scope, CLAUDE.md lists it as an open decision, README hedges ("subject to scope split with Libertee"). Three same-precedence documents, three statuses; precedence cannot break the tie.
3. **Where does an Esteem Play end and a gated DWSD Play begin?** Provisional answer as of 2026-07-29: the group-facilitation scenario — AI as facilitator, group present, visualization, "can we close now?" — stays an **Esteem** Play. Marked provisional; revisit when the DWSD Play layer becomes concrete.
4. **How deeply CRT and FRT get built** — full facilitation skills or model layer only. Deliberately deferred to plan-phase for that milestone.
5. **ESTEEM acronym** — the EEM letters are unresolved (CLAUDE.md).
6. **Render target for diagrams** — D3 vs. own SVG renderer (CLAUDE.md). Only relevant to the sibling repo's preview, but recorded because CLAUDE.md still lists it.

---
*Last updated: 2026-07-29 after doc ingest and roadmap creation*
