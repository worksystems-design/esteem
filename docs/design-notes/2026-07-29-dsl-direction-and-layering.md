# Design note — DSL direction and layering

**Date:** 2026-07-29
**Status:** direction agreed, nothing implemented yet
**Affects:** `models/cld/dsl.md`, `models/cld/cld-logic.md`, all archetype files, `skills/`, and the sibling repo `esteem-dsl-vscode`

This note records a design session. The DSL on disk is still v0.1 and unchanged;
everything below is the agreed direction for the next revision. It exists so the
reasoning survives the gap between sessions.

---

## Context

Two findings triggered this.

The fence tag in this repo (` ```cld `) did not match what the VSCode extension's
TextMate grammar injects on (` ```esteem.cld `), so a `.cld.md` produced by
`/esteem:cld-build` got no highlighting, diagnostics, or preview. That is fixed
(commit `f4e870e`).

Investigating that surfaced the larger question: is the DSL actually YAML? It is
not, and the way it fails is the problem.

---

## Decision 1 — The DSL becomes pure YAML

**Priority stated for this decision: interoperability and agent authoring over
human readability.**

The v0.1 format is YAML-*shaped* but not YAML. Measured against PyYAML:

| Section | Result |
|---|---|
| `variables:` | parses correctly as a list |
| `links:` | parses **successfully into a single folded string** — polarity, arrow and delay collapse into text |
| `loops:` | parses as a map by accident, because `B1 [balancing]:` happens to contain a colon |
| `archetype:` / `instance:` / `map:` | hard parse error — `mapping values are not allowed here` |

The `links:` behaviour is the dangerous one: it does not fail. Anyone writing a
downstream tool who reaches for `yaml.safe_load()` gets a plausible-looking dict
in which half the semantics has silently become a string.

This is consistent with the DWSD DSLs, which are pure YAML — all 22 bundled
examples parse cleanly — and whose authoring skill states the same principle:
*"'it parsed' is not 'it is correct': you must check the diagnostics"* and
*"there is no hidden inline string-sugar"*. DWSD already migrated away from sugar
(`Doing aging: 3d`) toward spelled-out keys.

**Not a small nudge.** `links:` is the core of the language. Either links become
YAML structures or the format stays a separate language. Only the
`archetype:`/`instance:`/`map:` error is a one-line fix.

---

## Decision 2 — Polarity is `same` / `opposite`

`polarity: -` is a **hard YAML parse error**. `polarity: +` parses fine as the
string `'+'`. The two polarity values fail asymmetrically, and the failure is
invisible at authoring time — a fatal property for agent-authored files.

Both spelled-out options are domain-native, from different schools:

| Notation | School | Spelled out |
|---|---|---|
| `s` / `o` | Senge, *Fifth Discipline Fieldbook*; Kim / Pegasus | **same** / **opposite** |
| `+` / `−` | Forrester, Sterman, *Business Dynamics* | positive / negative |

`same` / `opposite` wins on three grounds:

1. `cld-logic.md` already glosses the polarities as *"same direction"* /
   *"opposite direction"*. The DSL would adopt vocabulary the semantics file
   already speaks.
2. All twelve archetypes cite Senge and Kim, not Sterman. Esteem already sits in
   the S/O tradition.
3. `cld-logic.md` explicitly warns that polarity *"describes the direction of
   change, not moral valence"*. `negative` invites exactly the misreading the
   model file has to defend against.

Side effect: the loop-type rule reads better — "count the number of `opposite`
links" needs no symbol decoding.

---

## Decision 3 — Loop paths are YAML lists, not arrow strings

Considered: keeping DWSD's `path:` arrow scalar (`a -> b -> c`) for family
consistency. Rejected.

The decisive test — the same error classes in both forms:

| Broken input | Arrow scalar | List |
|---|---|---|
| `a - > b` (space in arrow) | YAML says OK | – |
| `a → b` (Unicode instead of ASCII) | YAML says OK | – |
| `a ->> b` (typo) | YAML says OK | – |
| `a -> b ->` (truncated) | YAML says OK | – |
| arrows omitted entirely | YAML says OK | – |
| empty item `[a, , b]` | – | hard parse error |
| unclosed bracket | – | hard parse error |
| missing comma `[a b, c]` | – | `'a b'` → caught by the existing undeclared-variable check |

Six of six malformed arrow paths pass silently. That is the same silent-failure
class we are migrating away from in `links:`; reintroducing it in `loops:` would
be incoherent.

Further reasons: the arrow ambiguity (`→` vs `->`) would have to be
re-implemented in a second parser forever; whitespace normalisation becomes
manual; and a YAML parser gives a node range per list item, so a diagnostic can
underline the offending variable exactly instead of the whole line.

**Why this is not inconsistent with DWSD.** DWSD's arrows are *typed* (`->`
generate, `-->` copy, `..>` feedback) and carry the edge type. In a CLD loop the
arrow carries nothing — the links are already declared with polarity and delay in
`links:`. Applying DWSD's own rule (micro-syntax only where it carries meaning)
points at the list.

---

## Decision 4 — `loops:` is a record, not an authoring surface

Loops are **derivable**. Given `links:`, cycle detection finds every cycle, and
the polarity rule computes each one's type. Verified with a ~15-line derivation
against the hiring-treadmill example: `B1` → balancing, `R1` → reinforcing, both
matching the asserted IDs.

What `loops:` genuinely adds is not the path but: *which* cycles are worth
telling, what they are called, and what they mean.

Resulting shape:

```yaml
loops:
  - id: B1
    label: the fix
    path: [team-overload, hiring]
  - id: R1
    label: the trap
    path: [team-overload, hiring, coordination-overhead]
```

- **Implicit closure** — the path names the cycle once; the last element links
  back to the first. A 2-cycle is two entries, not three.
- **Type is derived, not authored.** The ID already carries the assertion (`B1`
  claims balancing) and the derivation confirms or contradicts it. A
  contradiction is not a syntax error but the point: *"you call this B1, but the
  polarities make it reinforcing."* That is the Validator role from the
  architecture. An explicit `type:` may remain **optional** — checked when
  present, derived when absent — for consumers that should not need to know the
  R/B prefix convention.
- **`label:`** carries the only genuinely non-derivable information. Today "the
  fix" / "the trap" exists only in the prose of the archetype files; as a field
  it becomes part of the structure and survives a trip through a foreign tool.

**Closure must not be enforced syntactically.** See Decision 5.

Effect on `cld-logic.md`: of the five well-formedness rules, "loop closes
(first = last)" disappears as an authoring obligation and "declared type matches
the polarity rule" becomes a derived fact rather than a rule the author must
satisfy.

Rejected alternatives: link IDs referenced from loops (`links: [L1, L2]`) — zero
redundancy, but every link needs an ID most will never use, and a wrong `L7` is
far harder to spot than a wrong variable name. Adjacency notation for links
(`team-overload: { hiring: same }`) — more compact, but variable names become
YAML keys, which exposes the full Norway problem, loses ordering, and lets some
parsers silently drop duplicate keys.

---

## Decision 5 — Open state needs no notation; near-miss is a facilitation primitive

A CLD is built in dialog. Loops are **open** for most of a session, and closing
is a discovery event — "is something still missing, or can we close now?"

An earlier proposal to make non-closing loops unrepresentable was wrong: it makes
the working state of an actual session unwritable, and it contradicts the already
locked tolerance decision in the sibling repo (Phase 2, SC-5, from spike 007:
*a partial DSL produces a valid `{ast, diagnostics}` tuple — never throws*).

The resolution: **the open state is already representable — it is `links:`.** A
session with eight links and no `loops:` entry is valid YAML and a valid partial
model. `loops:` entries appear when a cycle closes and the group names it.

Two derived queries serve the facilitation directly:

1. **closed cycles** — what just closed, and of which type
2. **near miss** — which single edge would close a cycle

Simulated over the hiring-treadmill link sequence, after the third link:

```
+ Link: hiring -> coordination-overhead [same]
    CLOSED:      team-overload -> hiring  (balancing)
    ONE EDGE SHORT: coordination-overhead -> hiring
    ONE EDGE SHORT: coordination-overhead -> team-overload
```

The tool does not assert the edge exists. It says: *if* this edge existed, a
cycle would close. Whether the causality is real is the group's call. That is the
reasoning-partner stance — narrow the search space, leave the claim with the
human — and the same rule as *"refuse to invent variables the user did not
mention"*, applied to links.

Consequences beyond the DSL:

- **`cld-build`'s dramaturgy changes.** Step 3 currently asks "do you see a loop
  here?". With derivation the tool reports the closure and the group supplies name
  and meaning. Machine does cycle detection, humans do interpretation.
- **The preview gets a job.** Rendering near-miss edges as ghost arrows is the
  visual form of the facilitator's question. Phase 5+ material, but it shapes the
  AST, so it is noted now.
- **Implementation caveat.** Cycle enumeration is exponential in a dense graph;
  the prototype capped path length at 8. Real CLDs (under ~15 variables) are
  fine, but the implementation needs a limit or the preview will hang on an
  accidentally dense graph.

---

## Decision 6 — Separate the mechanical layer from the didactic layer

DWSD distinguishes **Skills** (mechanical: read and author the DSL) from **Play**
(a didactically built sequence, usually with an intention, for working with a
group). Esteem should make the same distinction.

Esteem already has it by half: `cld-teach` is a pure Play (no file output).
`cld-build` is a Play with a Skill baked in:

| Mechanical (Skill) | Didactic (Play) |
|---|---|
| Step 2 — write the file skeleton | Step 1 — situation framing |
| Step 4 — validity check | Step 3 — one question per turn, reflect back |
| Step 5 — archetype matching mechanics | Step 6 — close |
| Edit-in-place strategy, single-file constraint | the whole *Co-Creation Stance* |

Everything in Decisions 4 and 5 — cycle detection, near miss, type derivation,
closure status, tolerant diagnostics — is Skill material.

**Esteem's Skill layer must be scoped more narrowly than DWSD's.** DWSD's skill
does NL→DSL, which works because a board is a *descriptive* artifact — you know
your board, you just want it in text. A CLD is an *epistemic claim*: you do not
know your causal loop, you construct it. A `cld-author` that generates a finished
CLD from a description is precisely what CONTRIBUTING.md lists under *What We
Don't Want*. Esteem's Skill layer is therefore **read, validate, derive, write
what was confirmed** — not generate. Cycle detection is mechanical; "this edge
exists" is not.

**Esteem does not need DWSD's `cards/`.** DWSD has no model layer — its cards are
the knowledge, fused with the mechanical skill. Esteem has `models/` already:

| DWSD | Esteem |
|---|---|
| `cards/` + `docs/` | `models/cld/` (exists) |
| `SKILL.md` (mechanical) | **missing — this is the gap** |
| Play (elsewhere) | `skills/cld-build`, `skills/cld-teach` |

**Weight of the argument.** For DWSD the Skill/Play boundary is also a
*distribution* boundary: Plays hold proprietary expertise and are expected to be
served from a gated MCP server rather than shipped on disk. Esteem is MIT and
public, so that argument does not apply here. What remains is reuse — the
mechanics are identical across CLD, CRT, FRT and EC, and baked into each build
skill they would be written seven times and drift apart.

Because the boundary carries less weight here, the response should be
proportionate: a **convention inside `skills/`** — naming, frontmatter, shared
reference files — not a separate architecture. This also dissolves the practical
constraint that Claude Code loads all user-invocable skills from `skills/`.

**One consideration points the other way.** If DWSD Plays are served from a gated
server, one of them could consume Esteem's mechanics rather than duplicate them.
That would make the mechanical layer an interface for a consumer outside this
repo — documented and stable, not just internally tidy.

---

## Open questions

- **Where does an Esteem Play end and a DWSD Play begin?** *Provisional answer
  (2026-07-29): the group-facilitation scenario — AI as facilitator, group
  present, visualisation, "can we close now?" — is an **Esteem** Play.* Marked
  provisional; revisit when the DWSD Play layer becomes concrete.
- **Version number.** `plugin.json` is at `0.1.0`. The fence-tag change is
  already breaking, and the YAML migration much more so. `0.2.0` collides with
  the README roadmap, which assigns v0.2 to the Pattern Matcher (`cld-detect`).
  Undecided: `0.1.x`, renumber the roadmap, or bump only with the next feature.
- **Migration timing.** Own milestone, or folded into the next one?

## Migration impact

**This repo.** Rewrites, not search-and-replace: `dsl.md`, the polarity rule in
`cld-logic.md`, twelve archetype structure blocks, the example transcript, and
`cld-build/SKILL.md` — where the *writing strategy* also changes, because
appending to a YAML list differs from appending a line.

**`esteem-dsl-vscode`.** The expensive part. `lexer.ts` / `parser.ts` /
`tokens.ts` / `recovery.ts` largely become obsolete, replaced by a YAML parser
plus a semantic validation layer. That collides with the core's `deps: {}` (the
framework-free constraint itself survives — a pure-JS YAML library imports
nothing from node or vscode). Diagnostics must be rehung on the YAML parser's
ranges. Large parts of 145 + 50 tests, and 33 spike fixtures, need redoing. The
TextMate grammars get *simpler* — they could delegate to `source.yaml`. Phase 4
(renderer) is largely unaffected; it consumes the AST.

**Timing argument.** The extension is unpublished and the plugin has effectively
no users. This is the cheapest this decision will ever be.

**Unaffected:** the `esteem.cld` fence tag survives the migration unchanged —
DWSD does the same, with `dwsd.board` fences containing YAML. The tag says "this
is YAML, and specifically a CLD". The `.cld.md` suffix is also unaffected; it
names the markdown container, not the block.
