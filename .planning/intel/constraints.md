# Constraints

Repo root: `C:/Users/Thomy/Documents/projects/2026-04 esteem` — `source:` paths are repo-relative.

**Ingest-set note:** the ingest set contains **no SPEC-classified documents**. The
entries below are constraints that the DOC- and ADR-classified sources state as
*binding* (enforced, load-bearing, or breaking-if-violated), extracted here so they
are not buried in prose. Each carries its originating source and type. Nothing is
promoted to SPEC status; provenance is preserved verbatim.

---

## Two-layer separation: skills must never embed model logic
- source: CLAUDE.md, CONTRIBUTING.md, README.md
- type: nfr
- content: Layer 1 (`models/`) holds stable, domain-independent thinking structures — no facilitation, no dramaturgy. Layer 2 (`skills/`) holds facilitation arcs that *invoke* models. A skill must never redefine model logic inline; if CLD rules are being copied into a skill, they must be extracted to `models/cld/` and referenced. CONTRIBUTING.md states the enforcement explicitly: "If a PR violates this rule, it will get reverted regardless of how well it works in isolation. The rule is load-bearing." CLAUDE.md marks the section "(CRITICAL)" and calls it the central design constraint and the main thing Libertee did not do.

## DSL fence tags are always `esteem.<model>`, never the bare model name
- source: CLAUDE.md
- type: protocol
- content: DSL blocks live as fenced code blocks under the `esteem.` namespace — `esteem.cld`, `esteem.crt`, `esteem.frt`, `esteem.ec`. "Fence tags are always `esteem.<model>` — never the bare model name." The namespace prevents collisions with other tools claiming a generic tag like `cld`, and it is what the VSCode extension's TextMate grammar injects on. Any new model follows the same shape. The `.cld.md` file suffix is unaffected — it names the markdown container, not the block. (ADR confirms this tag survives the YAML migration unchanged; see `decisions.md` and the INFO section of `INGEST-CONFLICTS.md`.)

## `models/cld/dsl.md` is SHA-256 pinned into the sibling repo — any change breaks its CI
- source: CLAUDE.md
- type: protocol
- content: `models/cld/dsl.md` is the single source of truth for the DSL grammar and is mirrored into the sibling repo `../2026-04 esteem-dsl-vscode/docs/dsl.md`, pinned by SHA-256. Any change to `dsl.md` breaks that repo's CI until someone runs `pnpm sync-spec` there and commits the new pin. The two repos must stay side by side in the same parent directory — `sync-spec.sh` resolves the source via the relative path `../2026-04 esteem/models/cld/dsl.md`. **Planning impact:** ADR-D1..D4 all rewrite `dsl.md`, so this coupling fires on the migration.

## Sibling-repo tolerance decision is already locked (external to this repo)
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- type: nfr
- content: The ADR defers to an already-locked decision in the sibling repo `esteem-dsl-vscode` — Phase 2, SC-5, from spike 007: "a partial DSL produces a valid `{ast, diagnostics}` tuple — never throws". ADR-D5 is explicitly shaped to honour it (an earlier proposal to make non-closing loops unrepresentable was rejected partly because it contradicted this decision). This constraint is locked *outside* the ingest set — it cannot be renegotiated from within this repo's planning.

## Purely declarative Markdown — no build step, no source compilation
- source: CONTRIBUTING.md
- type: nfr
- content: Design Principle 4: "Markdown is the source of truth. Models, skills, agents, examples — all Markdown with YAML frontmatter. No build step, no source compilation." *What We Don't Want* additionally rules out "Methods that require external tools, APIs, or code. Esteem is purely declarative Markdown. Renderers and integrations live in separate, downstream tools." **See the open WARNING in `INGEST-CONFLICTS.md`** on where ADR-D6's mechanical Skill layer (cycle detection, derivation) is implemented relative to this constraint.

## Convergent stance — no generative or divergent skills
- source: CONTRIBUTING.md, CLAUDE.md, README.md
- type: nfr
- content: Esteem narrows the answer space; divergent/generative work belongs in Libertee. Esteem skills do not brainstorm or propose — they elicit, validate, and mirror. The agent is a reasoning partner, not a protagonist: no advocacy, no debate, no taking-the-stage. Cognitive load stays with the user; the skill structures and asks, the user thinks. A facilitation arc with dramaturgy but no underlying model is "just chat" — Esteem skills always invoke a model. ADR-D6 applies this constraint to the mechanical layer: "read, validate, derive, write what was confirmed — not generate."

## Plugin language is English
- source: CLAUDE.md, CONTRIBUTING.md
- type: nfr
- content: All files in the repo — skills, agents, models, archetypes, README, examples — are written in English. Runtime conversation between the user and the agent may be any language. Matches the Libertee convention.

## Runtime i18n — detect once, pass explicitly to subagents
- source: CLAUDE.md, CONTRIBUTING.md, README.md
- type: nfr
- content: Detect the user's language once from input and pass it explicitly to all spawned agents. No hardcoded strings. All agents respond in the user's detected language. Variable names stay in `kebab-case`, language-neutral within each CLD.

## Cross-platform: single-file artifacts, no folder structures, no sidecars
- source: README.md
- type: nfr
- content: Esteem is built to work in both local Claude Code and Claude Cowork. Artifacts are single-file — no folder structures, no sidecars. (ADR-D6 notes the single-file constraint and the edit-in-place strategy are part of `cld-build`'s mechanical layer, and that the writing strategy changes under the YAML migration because appending to a YAML list differs from appending a line.)

## Frontmatter shape per file class
- source: CONTRIBUTING.md, CLAUDE.md
- type: schema
- content: Structural validation requires — skill files: valid YAML frontmatter with `description`, `argument-hint`, `allowed-tools`, `user-invocable`; agent files: `name`, `description`, `model`, `maxTurns`; model files: `name`, `description`, `layer`, `model`. Skills referencing a model file must point at an existing path under `models/`. CLAUDE.md adds: agent model `sonnet` (reserve `opus` for synthesis only if needed), agent `maxTurns` 3–5, skills carry `user-invocable: true` and an `argument-hint`.

## Structural tests only — not content tests
- source: CONTRIBUTING.md
- type: nfr
- content: Design Principle 8: "Structural tests, not content tests. Tests verify file structure, frontmatter shape, and skill-flow contracts — not LLM output content. LLM variation is expected."

## Cycle enumeration needs a path-length limit
- source: docs/design-notes/2026-07-29-dsl-direction-and-layering.md
- type: nfr
- content: Implementation caveat from ADR-D5: cycle enumeration is exponential in a dense graph; the prototype capped path length at 8. Real CLDs (under ~15 variables) are fine, but the implementation needs a limit or the preview will hang on an accidentally dense graph.

## Attribution required on contributed models and archetypes
- source: CONTRIBUTING.md, README.md
- type: nfr
- content: Cite the sources of any model or archetype contributed — Senge, Goldratt, Argyris, and Lipmanowicz/McCandless recur; credit the origin in the model file itself, not just the README. README carries a trademark notice disclaiming affiliation with Peter M. Senge / *The Fifth Discipline*, Pegasus Communications and the Kim/Anderson *Systems Archetypes* publications, and the Society for Organizational Learning (SoL). Licence is MIT.
