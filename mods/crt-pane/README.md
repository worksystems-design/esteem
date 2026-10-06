# crt-pane (experimental mod)

A Claude Code **mod** (function-hooks plugin) that shows the latest `esteem.crt`
block of a session in a side pane: a box-and-arrow Current Reality Tree in the
desktop app, VS Code and web/mobile surfaces, a text tree in the terminal.

This is tooling around Esteem, not part of the Esteem plugin itself: it is not
listed in `.claude-plugin/marketplace.json` and adds nothing to `models/` or `skills/`.

## Provisional notation

There is no CRT DSL in `models/crt/` yet (the DSL syntax family is an open
decision). The pane reads a provisional notation modelled on `esteem.cld` v0.1:

```esteem.crt
# title: Late deliveries
entities:
  ude1 [ude]:  Customers receive orders late
  c1:          Warehouse picks strictly FIFO
  c2:          Urgent orders are not flagged
  rc1 [root]:  No priority rules were ever defined
  rc2 [root]:  Order form has no urgency field
links:
  c1 → ude1
  rc1 & c2 → c1     # & = AND junction (jointly sufficient)
  rc2 → c2
```

Arrows read "if cause then effect"; `->` works too. When a real CRT spec lands
in `models/crt/`, `hooks/crt.ts` follows it.

## Where the pane picks a CRT up

- an `esteem.crt` block in Claude's reply or in your prompt
- a `.md` file written or edited in the session (the last block in it)
- `/crt path/to/file.md`; `/crt` alone reopens the pane

## Running it

From the repo root, in a terminal:

```sh
claude --plugin-dir mods/crt-pane
```

For the desktop app, add the folder's absolute path to `CLAUDE_CODE_PLUGIN_DIRS`
in the `env` block of `~/.claude/settings.json`:

```json
{ "env": { "CLAUDE_CODE_PLUGIN_DIRS": "/absolute/path/to/esteem/mods/crt-pane" } }
```

## Checks

```sh
claude plugin validate mods/crt-pane
claude plugin test mods/crt-pane
```
