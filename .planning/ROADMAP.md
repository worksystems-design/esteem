# Roadmap: Esteem

## Overview

Esteem has shipped one model end-to-end — Causal Loop Diagrams, twelve archetypes, two skills, one reference session — on a DSL that is YAML-*shaped* but not YAML. The current milestone fixes that at the root before anything else is built on top: the spec becomes pure YAML, every authored CLD in the repo is rewritten into it, the build skill learns to write and read the new form, the sibling VSCode repo is re-pinned and proven to consume it, and the repo's own documentation stops describing a version of itself that no longer exists. Only then does the next milestone start — CRT and FRT — because anything built against the v0.1 format would have to be rewritten immediately afterward.

**No version numbers appear in this roadmap.** Milestones are named themes. Numbers come into existence at release/tag time from what actually shipped, on two independent clocks: the plugin (`.claude-plugin/plugin.json`) and each model's format (`models/<model>/dsl.md` frontmatter `version:`).

**No dates appear in this roadmap.** The workshop driving CRT/FRT priority is directional, not binding.

## Milestones

- 🚧 **DSL Migration to Pure YAML** — Phases 1–5 (current)
- 📋 **CRT and FRT** — next, not yet phased
- 📋 **Pattern Matcher and Validator** — later
- 📋 **Further models** — EC, Ladder of Inference, PRT/TrT, First Principles (ownership open)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: DSL Specification Becomes Pure YAML** - Rewrite `dsl.md` and realign `cld-logic.md` so a YAML parser reads a CLD correctly
- [ ] **Phase 2: Authored CLD Content Migrated** - Every archetype block, the reference transcript and the README examples in the new format
- [ ] **Phase 3: Skill Layer Writes and Reads the New Format** - `cld-build` rewritten around derived loops, with the mechanics extracted once into a shared reference
- [ ] **Phase 4: Cross-Repo Round-Trip Proven** - The sibling repo consumes the new spec, its CI is green, and a fresh `.cld.md` renders
- [ ] **Phase 5: Repo Docs and Release Conventions Catch Up** - CHANGELOG, two-clock versioning, themed roadmap, CLAUDE.md aligned with reality

## Phase Details

### Phase 1: DSL Specification Becomes Pure YAML
**Goal**: A contributor or downstream tool author reading `models/cld/dsl.md` gets a format that a standard YAML parser reads correctly, and the model semantics speak the same vocabulary.
**Depends on**: Nothing (first phase)
**Requirements**: DSL-01, DSL-02, DSL-03, DSL-04, DSL-05, DSL-06, DSL-07, MOD-01, MOD-02
**Success Criteria** (what must be TRUE):
  1. Someone calling `yaml.safe_load()` on any example in the spec gets the structure the spec describes — `links:` no longer collapses into a folded string, and `archetype:`/`instance:`/`map:` no longer raise a parse error
  2. Polarity reads `same` / `opposite` everywhere in the spec, and the loop-type rule reads as "count the `opposite` links" without symbol decoding
  3. A loop is recorded as `id` + `label` + `path` (a YAML list, closing implicitly), and the spec says plainly that type is derived and an explicit `type:` is optional
  4. A CLD with links and no loops is documented as a valid, complete-for-now document — the spec never demands closure
  5. `cld-logic.md`'s well-formedness rules no longer ask the author to close loops or to match a declared type, and its polarity gloss matches the DSL's words
  6. `dsl.md` frontmatter carries a `version:` for the new format that is explicitly independent of the plugin version
**Plans**: TBD

**Notes for planning**
- This is the moment the SHA-256 pin in `../2026-04 esteem-dsl-vscode/docs/dsl.md` goes stale and that repo's CI goes red. That is expected and accepted; it is closed out in Phase 4. Re-syncing opportunistically is fine, but the gate is Phase 4.
- Rewrites, not search-and-replace. The ADR is explicit about this.
- `docs/design-notes/2026-07-29-dsl-direction-and-layering.md` is a dated record and must **not** be rewritten — it documents the old format on purpose.
- Keep the two-layer line clean: the polarity rule and the derivation *semantics* belong in `cld-logic.md` (Layer 1); the *procedure* for enumerating cycles belongs in Phase 3's shared skill reference.

### Phase 2: Authored CLD Content Migrated
**Goal**: Every CLD written down in this repo is in the new format, so nothing a reader copies teaches them the old one.
**Depends on**: Phase 1
**Requirements**: CNT-01, CNT-02, CNT-03, CNT-04
**Success Criteria** (what must be TRUE):
  1. All twelve archetype generic-structure blocks are in the new format, and no file still shows `[+]` / `[-]` polarity, Unicode arrows in links, or `B1 [balancing]: a → b → a` loop lines
  2. `examples/fixes-that-fail-session.md` reads as a coherent session in the new format — including the intermediate file state at each step, not just the final block
  3. The README's DSL examples show the new format
  4. Running `yaml.safe_load()` over every `esteem.cld` block in every tracked file yields a mapping, with the dated design note the only deliberate exception
**Plans**: TBD

**Notes for planning**
- Inventory as it stands today: `models/cld/dsl.md` (4 blocks, done in Phase 1), eleven archetype files carrying twelve blocks (`fixes-that-fail.md` has 2; `shifting-the-burden-to-the-intervenor.md` has none and needs checking rather than rewriting), `examples/fixes-that-fail-session.md` (2), `README.md` (2), `skills/cld-build/SKILL.md` (2, handled in Phase 3), `CLAUDE.md` (1, handled in Phase 5).
- `.transient/starting-not-shipping.cld.md` is gitignored and out of scope.
- The `esteem.cld` fence tag and the `.cld.md` suffix do not change.

### Phase 3: Skill Layer Writes and Reads the New Format
**Goal**: A user running `/esteem:cld-build` gets a valid-YAML file and a session where the tool does the cycle detection and the human does the interpretation.
**Depends on**: Phase 1 (needs the spec; benefits from Phase 2's worked examples)
**Requirements**: SKL-01, SKL-02, SKL-03, SKL-04, SKL-05, SKL-06
**Success Criteria** (what must be TRUE):
  1. A file grown turn by turn through a `cld-build` session is valid YAML at every intermediate state, stays a single file with no sidecars, and works in both local Claude Code and Claude Cowork
  2. When a link closes a cycle, the session says so and asks the user to name it and say what it means — rather than asking "do you see a loop here?"
  3. When a single missing edge would close a cycle, the session offers that as a question and never writes the edge into the file on its own
  4. A reader can find cycle detection, the closed-cycle and near-miss queries, loop-type derivation, closure status, tolerant diagnostics and the path-length cap written down in exactly one place, referenced by the build skill rather than repeated inside it
  5. `/esteem:cld-teach` shows nothing in the retired notation
**Plans**: TBD

**Notes for planning**
- All of this stays declarative Markdown. The mechanics are instructions the agent performs at runtime — there is no code in this repo. The parser, renderer and any real path-length enforcement live in `esteem-dsl-vscode`.
- Two-layer rule applies with full force: the shared reference may state *procedure* and must reference `models/cld/` for the *semantics*. Copying the polarity rule into `skills/` is the exact violation CONTRIBUTING says gets reverted.
- The writing strategy genuinely changes: appending to a YAML list is not appending a line. Step 2 (skeleton), Step 3 (co-creation), Step 4 (validity check) and the edit-in-place strategy in `skills/cld-build/SKILL.md` all move.
- **Where the shared reference lives depends on an open question** — see PROJECT.md Open Question 1 (is CLAUDE.md's `skills/shared/` taxonomy retired or deferred?). Do not silently pick a location; surface it during planning.
- The motivation for extracting rather than inlining is reuse across CLD, CRT, FRT and EC. That payoff lands in the next milestone, so the interface should be written to be readable from outside `cld-build`.

### Phase 4: Cross-Repo Round-Trip Proven
**Goal**: The migration is consumable — the sibling repo builds on the new spec and a freshly built CLD renders in the preview. This is the milestone's Definition of Done.
**Depends on**: Phase 3
**Requirements**: XRP-01, XRP-02, XRP-03
**Success Criteria** (what must be TRUE):
  1. `pnpm sync-spec` has been run in `../2026-04 esteem-dsl-vscode` and the new SHA-256 pin is committed there
  2. That repo's CI is green against the new spec
  3. A `.cld.md` produced by a real `/esteem:cld-build` session renders in the VSCode preview — highlighting, diagnostics and all
**Plans**: TBD

**Notes for planning**
- This phase crosses a repo boundary. The sibling repo's own parser rewrite (`lexer.ts` / `parser.ts` / `tokens.ts` / `recovery.ts` largely replaced by a YAML parser plus semantic validation, diagnostics rehung on YAML node ranges, ~145 + 50 tests and 33 spike fixtures redone) is planned and executed **in that repo**, not here. What is in scope here is the sync, the pin, and proving the round-trip.
- The two repos must stay side by side in the same parent directory — `sync-spec.sh` resolves the source via `../2026-04 esteem/models/cld/dsl.md`.
- If the round-trip surfaces a gap in the spec, that is a Phase 1 revision, not a workaround here. Better to find it now than after a release.
- Honor the sibling's locked tolerance decision: a partial DSL produces a valid `{ast, diagnostics}` tuple and never throws.

### Phase 5: Repo Docs and Release Conventions Catch Up
**Goal**: Someone landing on the repo — a user, a contributor, or Claude reading CLAUDE.md — is told what Esteem actually is and how it is versioned.
**Depends on**: Phase 4
**Requirements**: REL-01, REL-02, REL-03, REL-04
**Success Criteria** (what must be TRUE):
  1. `CHANGELOG.md` exists and records the DSL migration as a breaking change, written from what actually shipped
  2. The two-clock versioning convention is written down where a contributor will find it — plugin version in `.claude-plugin/plugin.json`, per-model format version in `models/<model>/dsl.md` frontmatter
  3. The README describes direction as named themes with no version numbers — the v0.2 / v0.3 / v0.4+ roadmap is gone
  4. CLAUDE.md no longer contradicts the repo: the status line, the planned skill tree, and the open decisions that events or the ADR have settled are all corrected, and the ones that are genuinely still open stay listed as open
**Plans**: TBD

**Notes for planning**
- Deliberately last: the CHANGELOG entry and any release number are written from what shipped, not predicted up front.
- CLAUDE.md's stale items, concretely: `Status: Konzeptphase` (v0.1 shipped); the `diagnostic-arc/ conflict-resolution/ future-design/ shared/` skill tree (see Open Question 1 — align it to whatever was decided in Phase 3, do not invent an answer here); "DSL syntax family: YAML-style vs. code-style" (settled by ADR-D1); "First archetype to implement end-to-end" (settled by events). **Keep open**: the ESTEEM acronym, the render target, and First Principles ownership.
- README's DSL *examples* were handled in Phase 2; this phase touches the roadmap section and the surrounding framing.

## Next Milestone (not yet phased)

**CRT and FRT.** Current Reality Tree and Future Reality Tree, ahead of the Pattern Matcher and the Validator that the retired README roadmap listed first. The driver is a workshop in which CLDs, CRTs and FRTs are all intended — directional, not binding, and deliberately undated here.

**Scope expectation (user, 2026-07-29): these are to be considerably simpler than CLD.** That is structural, not a wish. A CRT/FRT is acyclic, so the entire loop apparatus falls away — no cycle detection, no near-miss query, no loop-type derivation, no closure question, and no `loops:` section. An edge is a sufficient-cause claim rather than a signed relation, so there is no polarity and no delay. And there is no archetype catalogue: nothing in the TOC tradition corresponds to Senge's twelve. What remains is nodes, edges, and a validation reduced to acyclicity plus sufficient-cause checking.

Plan these at that weight. If a CRT milestone starts looking like the CLD one, something has been over-modelled.

Deliberately undecided until that milestone is planned:
- Whether each gets a full facilitation skill or the model layer only
- Whether the CRT and FRT DSLs are separate grammars or a shared tree grammar with two semantic layers
- How the shared mechanical reference from Phase 3 extends to tree models (cycle detection does not apply; sufficiency and necessity checking does)

Also unresolved and blocking part of the *further models* theme: whether First Principles Decomposition belongs to Esteem or stays in Libertee (PROJECT.md Open Question 2).

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. DSL Specification Becomes Pure YAML | 0/TBD | Not started | - |
| 2. Authored CLD Content Migrated | 0/TBD | Not started | - |
| 3. Skill Layer Writes and Reads the New Format | 0/TBD | Not started | - |
| 4. Cross-Repo Round-Trip Proven | 0/TBD | Not started | - |
| 5. Repo Docs and Release Conventions Catch Up | 0/TBD | Not started | - |
