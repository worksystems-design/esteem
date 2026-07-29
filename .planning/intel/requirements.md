# Requirements (Layer: PRD)

Repo root: `C:/Users/Thomy/Documents/projects/2026-04 esteem` — `source:` paths are repo-relative.

---

## No requirements extracted

**The ingest set contains no PRD-classified documents.** Classification breakdown
was 1 ADR + 3 DOC; the manifest (`.planning/ingest-manifest.yaml`) declares no PRD
and no SPEC.

No `REQ-*` entries are emitted. Per extraction discipline, absent is recorded as
absent rather than inferred: assigning requirement IDs to material that was never
authored as a requirement would give it a status the source does not carry.

**Closest available scope material, for the downstream roadmapper:**

- **Declared roadmap** — `README.md` states a versioned roadmap (v0.2 Pattern
  Matcher / `cld-detect`, v0.3 Validator / `cld-validate`, v0.4+ further models,
  plus a "Later" bucket). Captured verbatim in `context.md` under
  *Roadmap (README-declared)*. This is the nearest thing to a scope backlog in the
  ingest set, but it is DOC-grade, not PRD-grade — and note that ADR-D1..D6
  introduce a DSL migration that the README roadmap does not account for. See
  `INGEST-CONFLICTS.md` WARNING on the version-number collision.
- **Contribution acceptance rules** — `CONTRIBUTING.md` states structural
  validation criteria and explicit out-of-scope rules. Captured in
  `constraints.md` (binding rules) and `context.md` (process).
- **Agreed target behaviour** — the six ADR decisions in `decisions.md` are the
  authoritative statement of intended next-state behaviour for the DSL and the
  skills layer.

If requirement-grade input is needed, it must be authored or ingested separately;
it cannot be recovered from this document set without fabrication.
