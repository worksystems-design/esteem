## Conflict Detection Report

Mode: new (no existing PROJECT.md / REQUIREMENTS.md / ROADMAP.md / CONTEXT.md to check against).
Ingest set: 4 docs — 1 ADR, 3 DOC. Precedence applied: ADR(0) > SPEC > PRD > DOC(3).
Repo root: C:/Users/Thomy/Documents/projects/2026-04 esteem

### BLOCKERS (0)

None. No LOCKED ADRs exist in the ingest set (the single ADR carries
"Status: direction agreed, nothing implemented yet", so locked=false), no
UNKNOWN or low-confidence classifications, and no locked existing context to
contradict. The one detected reference cycle was assessed as non-derivational
and downgraded — see the first WARNING.

### WARNINGS (6)

[WARNING] Cross-ref cycle CLAUDE.md <-> README.md — downgraded from BLOCKER, needs sign-off
  Found: cycle detection on the cross_refs graph returned one cycle: CLAUDE.md -> README.md -> CLAUDE.md
  Found: inspection of both edges shows they are non-derivational. README.md:157 is the bare string "CLAUDE.md" inside the plugin-layout code block; CLAUDE.md:98 is the bare string "README.md" inside the repo-structure code block. Neither is a hyperlink and neither claims the other as authority for any content
  Impact: the default rule is cycle -> BLOCKER with synthesis halted on the cyclic set. Applying it literally would gate the entire ingest over two filenames in directory listings, and would drop 2 of 4 docs. Synthesis was therefore performed on all four docs and this is reported as a WARNING instead, which still requires explicit approval before routing
  → Confirm the downgrade is acceptable. If you want the strict rule enforced, re-run with the two file-tree mentions removed from the classifier's cross_refs, or drop one doc from --manifest

[WARNING] Skill taxonomy: CLAUDE.md's planned skills vs README's shipped skills
  Found: CLAUDE.md:76-100 "Repo Structure (planned)" lists skills/ as diagnostic-arc/, conflict-resolution/, future-design/, shared/ — plus an assets/ directory and models/cld/ without dsl.md
  Found: README.md:133-158 "Plugin layout" lists skills/ as cld-teach/ and cld-build/ (with agents/elicitor.md), and models/cld/ with dsl.md — and README.md:172-190 gives a roadmap of cld-detect, cld-validate and further models that never mentions the diagnostic-arc / conflict-resolution / future-design taxonomy
  Found: the ADR (precedence 0) corroborates README by referring to skills/cld-build/SKILL.md and skills/cld-teach as existing artifacts
  Impact: unresolved intent, not just a stale file. It is genuinely undecided whether the diagnostic-arc / conflict-resolution / future-design skill taxonomy is abandoned in favour of per-model cld-* skills, or still intended as a later organizing layer. The roadmapper will plan a different skill tree depending on the answer, and CLAUDE.md is a live conventions file that keeps re-asserting the old shape
  → Decide whether the planned taxonomy is retired or deferred, then update CLAUDE.md's "Repo Structure (planned)" section to match

[WARNING] Version number for the DSL migration collides with the README roadmap
  Found: the ADR "Open questions" states plugin.json is at 0.1.0, that the fence-tag change is already breaking and the YAML migration much more so, and that "0.2.0 collides with the README roadmap, which assigns v0.2 to the Pattern Matcher (cld-detect)". Options listed and left undecided: 0.1.x, renumber the roadmap, or bump only with the next feature
  Found: README.md:174-175 confirms the collision — "v0.2 — Pattern Matcher / New skill /esteem:cld-detect"
  Impact: the roadmapper cannot assign version numbers to milestones without picking one. Whichever way it goes, the README roadmap or the migration milestone has to be renumbered, and the choice is visible to any installed user
  → Choose one of the three options before routing, or explicitly defer versioning out of the roadmap

[WARNING] Migration timing is an open question the roadmap has no slot for
  Found: the ADR "Open questions" asks "Migration timing. Own milestone, or folded into the next one?" — left unanswered
  Found: README.md:172-190 roadmap (v0.2 Pattern Matcher, v0.3 Validator, v0.4+ more models, Later) contains no entry for the DSL migration at all, despite the ADR describing rewrites to dsl.md, cld-logic.md, twelve archetype blocks, the example transcript and cld-build/SKILL.md, plus a large rewrite in the sibling repo
  Impact: the largest single piece of agreed work in the ingest set is absent from the only declared roadmap. If not resolved, the roadmapper will either invent a milestone or silently drop the migration
  → Decide own-milestone vs folded-in, and where it sits relative to v0.2 Pattern Matcher

[WARNING] First Principles ownership: stated as in-scope, listed as undecided
  Found: CONTRIBUTING.md:16 lists "Inference clarity — Ladder of Inference, First Principles decomposition" under "Esteem includes models and skills from these domains" — an in-scope assertion
  Found: CLAUDE.md:109 lists "Whether First Principles lives in Esteem or stays in Libertee" under "Open Decisions (do not lock without discussion)"
  Found: README.md:185 hedges — "First Principles Decomposition (subject to scope split with Libertee)"
  Impact: three same-precedence DOCs, three different statuses; precedence cannot break the tie. Affects whether a models/first-principles/ tree is planned in v0.4+ and whether contributors are told the domain is open
  → Settle the Esteem/Libertee split for First Principles, then align CONTRIBUTING.md and CLAUDE.md to the same answer

[WARNING] Where the mechanical Skill layer is implemented — Markdown or code
  Found: ADR Decision 6 makes cycle detection, near-miss derivation, loop-type derivation, closure status and tolerant diagnostics "Skill material", and scopes the response to "a convention inside skills/ — naming, frontmatter, shared reference files — not a separate architecture". ADR Decision 5 adds an implementation caveat that cycle enumeration is exponential and "the implementation needs a limit", and notes the prototype capped path length at 8
  Found: CONTRIBUTING.md:25 lists under "What We Don't Want" — "Methods that require external tools, APIs, or code. Esteem is purely declarative Markdown." CONTRIBUTING.md:226 Design Principle 4 adds "No build step, no source compilation"
  Impact: not a flat contradiction — the ADR scopes the expensive parser/renderer work to the sibling repo esteem-dsl-vscode, which CONTRIBUTING explicitly permits as a downstream tool. But it leaves open whether derivation inside this repo is Markdown instructions the agent follows or executable code. That is a planning fork: a markdown convention is a documentation task, a derivation engine is an implementation milestone with a path-length cap and tests
  → Decide the implementation locus for the mechanical layer before the roadmapper sizes ADR-D4/D5/D6 work

### INFO (8)

[INFO] Auto-resolved: ADR > DOC on DSL format — temporal, not contradictory
  Note: README.md:69-84 documents the current v0.1 DSL (Unicode arrows, bracketed [+]/[-] polarity with delay:high, loops written as "B1 [balancing]: a -> b -> a" with explicit closure). ADR Decisions 1-5 replace exactly these forms with pure YAML, spelled-out same/opposite polarity, list loop paths and derived loop types. The ADR header states "The DSL on disk is still v0.1 and unchanged; everything below is the agreed direction for the next revision", so this is current-state vs agreed-next-state, not a contradiction. Both were preserved: current form in intel/context.md under "Current DSL form (v0.1, as documented today)", target form in intel/decisions.md. No BLOCKER raised

[INFO] Auto-resolved: ADR-D1/D2 supersede a CLAUDE.md open decision
  Note: CLAUDE.md:107 lists "DSL syntax family: YAML-style vs. code-style" under "Open Decisions (do not lock without discussion)". ADR Decision 1 settles it — pure YAML — and Decision 2 settles the polarity notation within it. ADR precedence 0 beats DOC precedence 3; the ADR wins and the CLAUDE.md line is stale. Note the ADR is not locked, so this remains reversible

[INFO] Auto-resolved: project status — CLAUDE.md "Konzeptphase" is stale
  Note: CLAUDE.md:9 reads "Status: Konzeptphase". README.md:7 reads "Status: early v0.1 — first model (Causal Loop Diagrams) and first archetype (Fixes that Fail) shipped end-to-end". The ADR (precedence 0) corroborates README by treating skills/cld-build/SKILL.md, skills/cld-teach, models/cld/dsl.md, twelve archetype structure blocks, an example transcript, plugin.json at 0.1.0 and landed commit f4e870e as existing. Higher precedence plus independent corroboration resolves it: the project has shipped v0.1. Recorded in intel/context.md under "Project status — conflicting statements"

[INFO] Auto-resolved: CLAUDE.md open decision on the first archetype is settled in fact
  Note: CLAUDE.md:110 lists "First archetype to implement end-to-end ('Fixes that Fail' is the candidate)" as an open decision. README.md:7 and README.md:100 record Fixes that Fail as shipped end-to-end and as the full reference example, and CONTRIBUTING.md:249 names examples/fixes-that-fail-session.md the canonical reference session. The decision is closed by events

[INFO] Downstream coupling fires on the migration
  Note: CLAUDE.md:70-74 records that models/cld/dsl.md is SHA-256 pinned into ../2026-04 esteem-dsl-vscode/docs/dsl.md, and that any change to dsl.md breaks that repo's CI until pnpm sync-spec is run and the new pin committed — also that the two repos must stay side by side in the same parent directory. ADR Decisions 1-4 all rewrite dsl.md, so this coupling is guaranteed to fire. No conflict between the sources; both agree. Captured in intel/constraints.md so it is not lost in prose

[INFO] Externally-locked decision honored, not contradicted
  Note: ADR Decision 5 defers to an already-locked decision in the sibling repo — Phase 2, SC-5, from spike 007: "a partial DSL produces a valid {ast, diagnostics} tuple — never throws". The ADR explicitly rejects an earlier proposal (make non-closing loops unrepresentable) partly because it contradicted that locked decision. No conflict arises, but note the constraint is locked outside this ingest set and cannot be renegotiated from this repo's planning. Recorded in intel/constraints.md

[INFO] ADR-D4 removes a well-formedness rule from the model layer
  Note: ADR Decision 4 states that of the five well-formedness rules in cld-logic.md, "loop closes (first = last)" disappears as an authoring obligation and "declared type matches the polarity rule" becomes a derived fact rather than a rule the author must satisfy. models/cld/cld-logic.md was not in the ingest set, so the current rule text could not be read or diffed — only the ADR's description of the change is available

[INFO] Fence tag and file suffix survive the migration unchanged
  Note: CLAUDE.md:55-66 makes esteem.<model> fence tags binding ("never the bare model name") and states the .cld.md suffix names the markdown container, not the block. The ADR's "Unaffected" section agrees on both points, citing DWSD's dwsd.board fences containing YAML as the same pattern. The earlier ```cld vs ```esteem.cld mismatch that triggered the design session is already fixed in commit f4e870e. Sources are consistent; no action needed
