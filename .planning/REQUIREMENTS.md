# Requirements: Esteem

**Defined:** 2026-07-29
**Core Value:** The agent structures, checks and mirrors the user's thinking — it never generates the thinking.

**Provenance note.** The doc ingest produced **no PRD-grade input** — the classification was 1 ADR + 3 DOC, and `intel/requirements.md` records the absence rather than inferring requirements. The v1 requirements below are derived from the six ADR decisions (`intel/decisions.md`), the user-supplied Definition of Done for the migration milestone, and the constraints in `intel/constraints.md`. They are checkable statements about this repo, not recovered PRD text.

---

## v1 Requirements

Current milestone: **DSL Migration to Pure YAML**. Each maps to exactly one roadmap phase.

### DSL Format (DSL)

- [ ] **DSL-01**: Every section of an `esteem.cld` block loads under a standard YAML parser into the structure it names — no section silently folds into a string
- [ ] **DSL-02**: Link polarity is written as `same` or `opposite`
- [ ] **DSL-03**: A loop path is a YAML list of variable names with implicit closure — the last element links back to the first, and a 2-cycle is two entries, not three
- [ ] **DSL-04**: A `loops:` entry carries `id`, `label` and `path`; `type:` is optional — derived when absent, checked when present
- [ ] **DSL-05**: `archetype:`, `instance:` and `map:` are expressible as valid YAML
- [ ] **DSL-06**: A CLD with links and no loops is a valid document — closure is never enforced syntactically
- [ ] **DSL-07**: `models/cld/dsl.md` carries a frontmatter `version:` identifying the new format on the model's own clock, independent of the plugin version

### Model Semantics (MOD)

- [ ] **MOD-01**: `models/cld/cld-logic.md` states polarity and the loop-type rule in the same `same`/`opposite` vocabulary the DSL uses
- [ ] **MOD-02**: The well-formedness rules no longer oblige the author to close loops or to declare a matching loop type — loop type is stated as a derived fact

### Authored Content (CNT)

- [ ] **CNT-01**: All twelve archetype structure blocks are written in the new format
- [ ] **CNT-02**: `examples/fixes-that-fail-session.md` shows the new format, including the file state at each step of the session
- [ ] **CNT-03**: The DSL examples in `README.md` show the new format
- [ ] **CNT-04**: Every `esteem.cld` block in a tracked file loads under `yaml.safe_load()` as a mapping — the dated design note under `docs/design-notes/` is exempt, it records the old format on purpose

### Skill Layer (SKL)

- [ ] **SKL-01**: `/esteem:cld-build` writes and grows a `.cld.md` as valid YAML — appending to a list rather than a line, edit-in-place, single file, no sidecars
- [ ] **SKL-02**: During co-creation the skill reports which cycles just closed and which single edge would close one, then asks the user for the name and the meaning — instead of asking "do you see a loop here?"
- [ ] **SKL-03**: The skill's validity check matches the revised well-formedness rules
- [ ] **SKL-04**: Cycle detection, closed-cycle and near-miss queries, loop-type derivation, closure status, tolerant diagnostics and the path-length cap are written once in a shared reference under `skills/` and referenced by build skills, not restated in each
- [ ] **SKL-05**: The mechanical layer never asserts a link the user did not confirm — a near miss is offered as a question, never written into the file
- [ ] **SKL-06**: `/esteem:cld-teach` teaches the current format — no v0.1 notation left in anything it shows

### Cross-Repo Round-Trip (XRP)

- [ ] **XRP-01**: `pnpm sync-spec` has been run in `../2026-04 esteem-dsl-vscode` and the new SHA-256 pin is committed there
- [ ] **XRP-02**: The sibling repo's CI is green against the new spec
- [ ] **XRP-03**: A `.cld.md` produced by `/esteem:cld-build` renders in the VSCode preview

### Release Conventions (REL)

- [ ] **REL-01**: `CHANGELOG.md` exists and records the DSL migration as a breaking change
- [ ] **REL-02**: The two-clock versioning convention is documented — plugin version in `.claude-plugin/plugin.json`, per-model format version in `models/<model>/dsl.md` frontmatter
- [ ] **REL-03**: `README.md` describes direction as named themes without version numbers; the v0.2/v0.3/v0.4+ roadmap is gone
- [ ] **REL-04**: `CLAUDE.md` no longer contradicts the repo's actual state — project status, the planned skill tree, and the open decisions that events or the ADR have settled

---

## v2 Requirements

Deferred to future milestones. Tracked, not in the current roadmap. Themes, not versions — numbers get assigned at release time from what shipped.

### Next milestone theme — CRT and FRT

- **CRT-01**: Current Reality Tree model layer — `models/crt/crt-logic.md`, `models/crt/dsl.md`, at least one realistic example
- **CRT-02**: A facilitation skill that builds a CRT in dialog *(depth deliberately undecided — model layer only vs. full skill is a plan-phase call)*
- **FRT-01**: Future Reality Tree model layer — `models/frt/frt-logic.md`, `models/frt/dsl.md`, at least one realistic example
- **FRT-02**: A facilitation skill that builds or validates an FRT in dialog *(same open depth question)*
- **REU-01**: CRT and FRT reuse the shared mechanical reference from SKL-04 rather than restating the mechanics

### Later theme — Pattern Matcher and Validator

- **DET-01**: `/esteem:cld-detect` — recognize an archetype from a situation description, without first building a CLD (the Pattern Matcher role)
- **VAL-01**: `/esteem:cld-validate <file>` — check an existing `.cld.md` for well-formedness and loop-type consistency (the Validator role)

### Later theme — further models

- **MDL-01**: Evaporating Cloud (EC)
- **MDL-02**: Ladder of Inference
- **MDL-03**: Prerequisite Tree (PRT) and Transition Tree (TrT)
- **MDL-04**: First Principles Decomposition — *blocked on the Esteem/Libertee ownership question, see PROJECT.md Open Questions*

### Later theme — session history

- **REC-01**: A session-recorder skill or hook, separate from the build skills, capturing reasoning history

---

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Parser, renderer, cycle-detection engine as executable code | CONTRIBUTING Design Principle 4 — purely declarative Markdown, no build step. All of it lives in the sibling repo `esteem-dsl-vscode`, which CONTRIBUTING permits as a downstream tool |
| Test suite and CI in this repo | ~2,400 lines of Markdown, no source code. Structural checks run by hand via `claude --plugin-dir ./`; the sibling repo owns automated testing |
| A generative `cld-author` skill | A CLD is an epistemic claim, not a descriptive artifact. Listed under CONTRIBUTING's *What We Don't Want* |
| Diagram rendering and VSCode preview implementation | Separate project (`esteem-dsl-vscode`). Only the round-trip *verification* is in scope here |
| Version numbers attached to milestones | Numbers are assigned at release/tag time from what actually shipped |
| Migrating `.transient/` sketches to the new format | Gitignored personal working files, not part of the repo's contract |
| Layout hints, quantification, conditional links, sub-model composition in the DSL | Explicitly deferred in `dsl.md` — added only when there is concrete pressure |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSL-01 | Phase 1 | Pending |
| DSL-02 | Phase 1 | Pending |
| DSL-03 | Phase 1 | Pending |
| DSL-04 | Phase 1 | Pending |
| DSL-05 | Phase 1 | Pending |
| DSL-06 | Phase 1 | Pending |
| DSL-07 | Phase 1 | Pending |
| MOD-01 | Phase 1 | Pending |
| MOD-02 | Phase 1 | Pending |
| CNT-01 | Phase 2 | Pending |
| CNT-02 | Phase 2 | Pending |
| CNT-03 | Phase 2 | Pending |
| CNT-04 | Phase 2 | Pending |
| SKL-01 | Phase 3 | Pending |
| SKL-02 | Phase 3 | Pending |
| SKL-03 | Phase 3 | Pending |
| SKL-04 | Phase 3 | Pending |
| SKL-05 | Phase 3 | Pending |
| SKL-06 | Phase 3 | Pending |
| XRP-01 | Phase 4 | Pending |
| XRP-02 | Phase 4 | Pending |
| XRP-03 | Phase 4 | Pending |
| REL-01 | Phase 5 | Pending |
| REL-02 | Phase 5 | Pending |
| REL-03 | Phase 5 | Pending |
| REL-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-29*
*Last updated: 2026-07-29 after initial definition from doc ingest*
