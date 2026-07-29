# Synthesis Summary

Entry point for downstream consumers (`gsd-roadmapper`). Produced by `gsd-doc-synthesizer`.

Mode: **new** — no existing PROJECT.md / REQUIREMENTS.md / ROADMAP.md / STATE.md / CONTEXT.md.
Repo root: `C:/Users/Thomy/Documents/projects/2026-04 esteem`
Precedence applied: `ADR(0) > SPEC > PRD > DOC(3)`

---

## Doc counts by type

| Type | Count | Sources |
|---|---|---|
| ADR | 1 | `docs/design-notes/2026-07-29-dsl-direction-and-layering.md` |
| SPEC | 0 | — |
| PRD | 0 | — |
| DOC | 3 | `README.md`, `CLAUDE.md`, `CONTRIBUTING.md` |
| UNKNOWN | 0 | — |

All 4 classifications consumed. All `confidence: high`, all `manifest_override: true`.

## Decisions

- **Total: 6** — ADR-D1 through ADR-D6, all from the single ADR.
- **Locked: 0.** The ADR header reads `Status: direction agreed, nothing implemented yet` — not `Accepted` — and the classifier set `locked: false`. All six are recorded as `proposed`.
- **These describe a target state, not the current one.** The DSL on disk is still v0.1 and unchanged. The ADR says so explicitly in its header.
- File: `intel/decisions.md`

Summary: D1 DSL becomes pure YAML · D2 polarity spelled out `same`/`opposite` · D3 loop paths are YAML lists · D4 `loops:` is a record, type derived · D5 open state needs no notation, near-miss is a facilitation primitive · D6 separate mechanical (Skill) from didactic (Play) layer.

## Requirements

- **Total: 0.** No PRD-classified documents in the ingest set.
- No `REQ-*` IDs emitted. The README's versioned roadmap is the nearest scope material but is DOC-grade; it is preserved verbatim in `intel/context.md` under *Roadmap (README-declared)* rather than promoted to requirement status.
- File: `intel/requirements.md` (records the absence and points at the substitutes)

**Downstream note:** the roadmapper receives no requirement-grade input from this ingest.

## Constraints

- **Total: 13.** No SPEC-classified documents exist; these are constraints the DOC and ADR sources state as *binding* (enforced, load-bearing, or breaking-if-violated), extracted so they are not buried in prose. Provenance preserved on every entry.
- Type breakdown: `nfr` 9 · `protocol` 2 · `schema` 1 · (1 entry is cross-typed under nfr)
- File: `intel/constraints.md`

Load-bearing ones for planning: two-layer separation (CONTRIBUTING states PRs violating it get reverted) · `esteem.<model>` fence namespace · `models/cld/dsl.md` SHA-256 pin into the sibling repo (breaks its CI on any change — and ADR-D1..D4 all change it) · sibling repo's already-locked tolerance decision (external, non-negotiable from here) · purely declarative Markdown with no build step.

## Context topics

- **Total: 16 topics** — project identity, project status, two-layer architecture, agent roles, model domains in scope, shipped skills, CLD model, current v0.1 DSL form, archetype catalog, roadmap, installation and layout, contribution process, file templates, testing, examples convention, open decisions (CLAUDE.md), open questions (ADR), migration impact, ADR triggering context, cross-repo relationships.
- File: `intel/context.md`

## Conflicts

- **0 blockers**
- **6 warnings** (competing/undecided — require resolution before routing)
- **8 auto-resolved** (INFO, recorded for transparency)
- Full detail: `../INGEST-CONFLICTS.md`

The six warnings, in short: (1) a cross-ref cycle `CLAUDE.md <-> README.md` that was assessed as non-derivational and **downgraded from the default BLOCKER** — needs sign-off; (2) CLAUDE.md's planned skill taxonomy vs README's shipped `cld-*` skills; (3) the migration's version number collides with README's v0.2 = Pattern Matcher; (4) migration timing is undecided and absent from the roadmap; (5) First Principles ownership is asserted in-scope by CONTRIBUTING but listed open by CLAUDE.md; (6) whether ADR-D6's mechanical Skill layer is Markdown or code.

## Cycle detection

Run over the `cross_refs` graph (DFS, three-color marking, depth cap 50 — not approached). Edges within the classified set:

```
CLAUDE.md      -> README.md
README.md      -> CLAUDE.md
CONTRIBUTING.md-> (none)
ADR            -> CONTRIBUTING.md, README.md
```

One cycle found: `CLAUDE.md -> README.md -> CLAUDE.md`. Both edges were inspected and are bare filenames inside repo-layout code blocks (`README.md:157`, `CLAUDE.md:98`) — not hyperlinks, not authority claims, no content dependency. Synthesis proceeded on all four docs; the cycle is reported as a WARNING with the downgrade rationale stated. See the first WARNING in `../INGEST-CONFLICTS.md`.

## Known gaps in the ingest set

Files referenced by the ingested docs but **not classified and not read** — the roadmapper should not assume their contents:

- `models/cld/dsl.md`, `models/cld/cld-logic.md`, `models/cld/archetypes/*` (twelve files + `_index.md`)
- `skills/cld-build/SKILL.md`, `skills/cld-teach/SKILL.md`, `skills/cld-build/agents/elicitor.md`
- `examples/fixes-that-fail-session.md`
- `plugin.json`, `.claude-plugin/marketplace.json`
- `../202604 esteem marketing/origin/esteem-planning.md` — CLAUDE.md calls this "the canonical source until we move it"
- The sibling repo `../2026-04 esteem-dsl-vscode` and its phase plan

## Files produced

- `intel/decisions.md` — 6 ADR decisions
- `intel/requirements.md` — records the absence of PRD input
- `intel/constraints.md` — 13 binding constraints
- `intel/context.md` — 16 topic-keyed notes
- `INGEST-CONFLICTS.md` — 0 blockers / 6 warnings / 8 info
