// Provisional esteem.crt notation (pane-local, NOT a spec — models/crt/ has none yet):
//
//   # title: Late deliveries
//   entities:
//     ude1 [ude]:  Customers receive orders late
//     c1:          Warehouse picks strictly FIFO
//     rc1 [root]:  No priority rules were ever defined
//   links:
//     c1 → ude1
//     rc1 & c2 → c1      # "&" = AND junction (jointly sufficient)
//
// Arrows read "if <cause> then <effect>". `->` works as well as `→`.

export type Kind = 'ude' | 'root' | 'effect'
export type Entity = { id: string; kind: Kind; text: string }
export type Crt = {
  title?: string
  entities: Map<string, Entity>
  /** effect id → its cause groups; a group of 2+ is an AND junction */
  causes: Map<string, string[][]>
  /** cause id → effect ids */
  effects: Map<string, string[]>
  problems: string[]
}

const FENCE = /```esteem\.crt[^\n]*\n([\s\S]*?)```/g

/** The body of the last esteem.crt block in a text, if any. */
export function lastBlock(text: string): string | undefined {
  let found: string | undefined
  for (const m of text.matchAll(FENCE)) found = m[1]
  return found
}

export function parse(src: string): Crt {
  const crt: Crt = { entities: new Map(), causes: new Map(), effects: new Map(), problems: [] }
  const links: { from: string[]; to: string; line: number }[] = []
  let section: 'entities' | 'links' | undefined

  src.split('\n').forEach((raw, i) => {
    const header = /^\s*#\s*title\s*:\s*(.+)$/.exec(raw)
    if (header) return void (crt.title = header[1]!.trim())
    const line = raw.replace(/\s#.*$/, '').trim()
    if (line === '' || line.startsWith('#')) return
    if (/^entities\s*:$/.test(line)) return void (section = 'entities')
    if (/^links\s*:$/.test(line)) return void (section = 'links')

    if (section === 'entities') {
      const m = /^-?\s*([\w-]+)\s*(?:\[\s*(ude|root)\s*\])?\s*(?::\s*(.*))?$/i.exec(line)
      if (!m) return void crt.problems.push(`line ${i + 1}: cannot read entity "${line}"`)
      const id = m[1]!
      if (crt.entities.has(id)) crt.problems.push(`entity "${id}" is declared twice`)
      crt.entities.set(id, { id, kind: (m[2]?.toLowerCase() as Kind) ?? 'effect', text: m[3]?.trim() ?? '' })
    } else if (section === 'links') {
      const m = /^(.+?)\s*(?:→|->)\s*([\w-]+)$/.exec(line)
      if (!m) return void crt.problems.push(`line ${i + 1}: cannot read link "${line}"`)
      links.push({ from: m[1]!.split('&').map(s => s.trim()).filter(Boolean), to: m[2]!, line: i + 1 })
    } else {
      crt.problems.push(`line ${i + 1}: outside entities:/links:`)
    }
  })

  for (const { from, to, line } of links) {
    const unknown = [...from, to].filter(id => !crt.entities.has(id))
    if (unknown.length) {
      crt.problems.push(`line ${line}: unknown ${unknown.map(u => `"${u}"`).join(', ')}`)
      continue
    }
    crt.causes.set(to, [...(crt.causes.get(to) ?? []), from])
    for (const f of from) crt.effects.set(f, [...(crt.effects.get(f) ?? []), to])
  }

  for (const e of crt.entities.values()) {
    if (e.kind === 'root' && crt.causes.has(e.id))
      crt.problems.push(`"${e.id}" is marked root but has causes below it`)
    if (!crt.causes.has(e.id) && !crt.effects.has(e.id))
      crt.problems.push(`"${e.id}" is not connected`)
  }
  return crt
}

export type Row =
  | { type: 'node'; prefix: string; entity: Entity; repeat?: 'seen' | 'loop' }
  | { type: 'and'; prefix: string }
  | { type: 'heading'; text: string }

/**
 * Lays the tree out top-down, the way a CRT is drawn: UDEs on top, their
 * sufficient causes beneath, root causes at the leaves.
 */
export function layout(crt: Crt): Row[] {
  const rows: Row[] = []
  const seen = new Set<string>()
  const all = [...crt.entities.values()]
  // Top-level trees start at UDEs that cause nothing further; a UDE feeding
  // another one is drawn inside that tree instead.
  let tops = all.filter(e => e.kind === 'ude' && !crt.effects.has(e.id))
  if (tops.length === 0) tops = all.filter(e => !crt.effects.has(e.id) && crt.causes.has(e.id))

  const walk = (id: string, lead: string, branch: string, path: Set<string>) => {
    const entity = crt.entities.get(id)!
    if (path.has(id)) return void rows.push({ type: 'node', prefix: lead + branch, entity, repeat: 'loop' })
    if (seen.has(id)) return void rows.push({ type: 'node', prefix: lead + branch, entity, repeat: 'seen' })
    seen.add(id)
    rows.push({ type: 'node', prefix: lead + branch, entity })
    const next = lead + (branch === '' ? '' : branch.startsWith('└') ? '   ' : '│  ')
    const groups = crt.causes.get(id) ?? []
    const inner = new Set(path).add(id)
    groups.forEach((group, gi) => {
      const last = gi === groups.length - 1
      if (group.length === 1) return walk(group[0]!, next, last ? '└─ ' : '├─ ', inner)
      rows.push({ type: 'and', prefix: next + (last ? '└─ ' : '├─ ') })
      const andLead = next + (last ? '   ' : '│  ')
      group.forEach((c, ci) => walk(c, andLead, ci === group.length - 1 ? '└─ ' : '├─ ', inner))
    })
  }

  for (const top of tops) walk(top.id, '', '', new Set())
  const loose = all.filter(e => !seen.has(e.id))
  if (loose.length && rows.length) rows.push({ type: 'heading', text: 'Not below any UDE' })
  for (const e of loose) if (!seen.has(e.id)) walk(e.id, '', '', new Set())
  return rows
}
