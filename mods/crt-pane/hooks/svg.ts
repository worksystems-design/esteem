import type { Crt, Entity } from './crt'

// Classic CRT drawing: causes at the bottom, UDEs on top, arrows pointing up
// ("if below, then above"), AND junctions as an ellipse across the arrows.

const BOX_W = 190
const GAP_X = 34
const GAP_Y = 64
const PAD = 24
const LINE = 15
const CHARS = 26

type Placed = { e: Entity; x: number; y: number; h: number; lines: string[] }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function wrap(text: string): string[] {
  const out: string[] = []
  let line = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && (line + ' ' + word).length > CHARS) {
      out.push(line)
      line = word
    } else line = line ? line + ' ' + word : word
  }
  if (line) out.push(line)
  if (out.length > 4) return [...out.slice(0, 3), out[3]!.slice(0, CHARS - 1) + '…']
  return out
}

/** Rank = longest chain of causes beneath; edges closing a loop are ignored. */
function ranks(crt: Crt): Map<string, number> {
  const rank = new Map<string, number>()
  const visiting = new Set<string>()
  const visit = (id: string): number => {
    const known = rank.get(id)
    if (known !== undefined) return known
    if (visiting.has(id)) return -1
    visiting.add(id)
    let r = 0
    for (const group of crt.causes.get(id) ?? []) for (const c of group) r = Math.max(r, visit(c) + 1)
    visiting.delete(id)
    rank.set(id, r)
    return r
  }
  for (const id of crt.entities.keys()) visit(id)
  return rank
}

const VIRTUAL_W = 14

export function toSvg(crt: Crt): { svg: string; width: number; height: number } {
  const rank = ranks(crt)
  const top = Math.max(0, ...rank.values())
  const layers: string[][] = Array.from({ length: top + 1 }, () => [])
  for (const id of crt.entities.keys()) layers[rank.get(id)!]!.push(id)

  // Edges skipping layers get a virtual waypoint per layer they cross, so
  // they are ordered (and routed) around the boxes instead of through them.
  const up = new Map<string, string[]>()
  const down = new Map<string, string[]>()
  const link = (a: string, b: string) => {
    up.set(a, [...(up.get(a) ?? []), b])
    down.set(b, [...(down.get(b) ?? []), a])
  }
  const chains = new Map<string, string[]>() // "cause>effect#group" → waypoint ids
  for (const [effect, groups] of crt.causes)
    groups.forEach((group, gi) => {
      for (const c of group) {
        const from = rank.get(c)!
        const to = rank.get(effect)!
        if (from >= to) continue // closes a loop: drawn on the side
        const chain: string[] = []
        for (let r = from + 1; r < to; r++) {
          const v = `\u0000${c}>${effect}#${gi}@${r}`
          layers[r]!.push(v)
          chain.push(v)
        }
        ;[c, ...chain, effect].reduce((a, b) => (link(a, b), b))
        chains.set(`${c}>${effect}#${gi}`, chain)
      }
    })
  const isVirtual = (id: string) => id.startsWith('\u0000')
  const slotW = (id: string) => (isVirtual(id) ? VIRTUAL_W : BOX_W)

  // Barycenter sweeps to reduce crossings.
  const pos = new Map<string, number>()
  const index = () => layers.forEach(l => l.forEach((id, i) => pos.set(id, i - (l.length - 1) / 2)))
  index()
  const avg = (ids: string[], own: number) => (ids.length ? ids.reduce((s, i) => s + pos.get(i)!, 0) / ids.length : own)
  for (let sweep = 0; sweep < 8; sweep++) {
    const downward = sweep % 2 === 0
    const order = downward ? [...layers.keys()].reverse() : [...layers.keys()]
    for (const li of order) {
      const key = (id: string) => avg((downward ? up : down).get(id) ?? [], pos.get(id)!)
      const keys = new Map(layers[li]!.map(id => [id, key(id)]))
      layers[li]!.sort((a, b) => keys.get(a)! - keys.get(b)!)
      index()
    }
  }

  const spanOf = (l: string[]) => l.reduce((s, id) => s + slotW(id), 0) + Math.max(0, l.length - 1) * GAP_X
  const width = PAD * 2 + Math.max(BOX_W, ...layers.map(spanOf))
  const placed = new Map<string, Placed>()
  const via = new Map<string, { x: number; top: number; bottom: number }>()
  const rowH = layers.map(l =>
    Math.max(30, ...l.filter(id => !isVirtual(id)).map(id => 30 + wrap(crt.entities.get(id)!.text).length * LINE)),
  )
  let y = PAD + 26
  for (let li = top; li >= 0; li--) {
    const l = layers[li]!
    let x = (width - spanOf(l)) / 2
    for (const id of l) {
      if (isVirtual(id)) via.set(id, { x: x + VIRTUAL_W / 2, top: y, bottom: y + rowH[li]! })
      else {
        const e = crt.entities.get(id)!
        const lines = wrap(e.text)
        placed.set(id, { e, x, y, h: 30 + lines.length * LINE, lines })
      }
      x += slotW(id) + GAP_X
    }
    y += rowH[li]! + GAP_Y
  }
  const height = y - GAP_Y + PAD + 22

  // A path from (fx,fy) up to (tx,ty) through waypoints, as smooth S-curves.
  const route = (fx: number, fy: number, points: { x: number; top: number; bottom: number }[], tx: number, ty: number) => {
    let d = `M${fx} ${fy}`
    let cx = fx
    let cy = fy
    for (const p of [...points].reverse()) {
      const my = (cy + p.bottom) / 2
      d += ` C${cx} ${my} ${p.x} ${my} ${p.x} ${p.bottom} L${p.x} ${p.top}`
      cx = p.x
      cy = p.top
    }
    const my = (cy + ty) / 2
    return d + ` C${cx} ${my} ${tx} ${my} ${tx} ${ty}`
  }

  const edges: string[] = []
  const ands: string[] = []
  for (const [effect, groups] of crt.causes) {
    const to = placed.get(effect)!
    // Entry slots along the box bottom, in the order the groups arrive from.
    const arrivesAt = (group: string[], gi: number) =>
      group.reduce((sum, c) => {
        const chain = chains.get(`${c}>${effect}#${gi}`) ?? []
        const last = chain.length ? via.get(chain[chain.length - 1]!)!.x : placed.get(c)!.x + BOX_W / 2
        return sum + last
      }, 0) / group.length
    const slots = groups.map((g, gi) => [gi, arrivesAt(g, gi)] as const).sort((a, b) => a[1] - b[1]).map(([gi]) => gi)
    groups.forEach((group, gi) => {
      const ex = to.x + BOX_W / 2 + (slots.indexOf(gi) - (groups.length - 1) / 2) * 36
      const ey = to.y + to.h
      const curve = (c: string, tx: number, ty: number, arrow: boolean) => {
        const from = placed.get(c)!
        const chain = chains.get(`${c}>${effect}#${gi}`)
        if (chain === undefined) {
          // Loop back: goes against the tree's direction.
          const side = Math.max(from.x, to.x) + BOX_W + 26
          return `<path class="loop" d="M${from.x + BOX_W} ${from.y + from.h / 2} C${side} ${from.y + from.h / 2} ${side} ${to.y + to.h / 2} ${to.x + BOX_W} ${to.y + to.h / 2}" marker-end="url(#arrow-loop)"/>`
        }
        const d = route(from.x + BOX_W / 2, from.y, chain.map(v => via.get(v)!), tx, ty)
        return `<path class="edge" d="${d}"${arrow ? ' marker-end="url(#arrow)"' : ''}/>`
      }
      if (group.length === 1) return void edges.push(curve(group[0]!, ex, ey, true))
      const jy = ey + 24
      for (const c of group) edges.push(curve(c, ex, jy, false))
      edges.push(`<path class="edge" d="M${ex} ${jy} L${ex} ${ey}" marker-end="url(#arrow)"/>`)
      ands.push(`<ellipse class="and" cx="${ex}" cy="${jy + 9}" rx="${16 + group.length * 4}" ry="7"/>`)
    })
  }

  const nodes = [...placed.values()].map(({ e, x, y, h, lines }) => {
    const text = lines.map((l, i) => `<tspan x="${x + 10}" dy="${i === 0 ? 0 : LINE}">${esc(l)}</tspan>`).join('')
    return `<g class="node ${e.kind}"><title>${esc(e.id)}${e.text ? ': ' + esc(e.text) : ''}</title>` +
      `<rect x="${x}" y="${y}" width="${BOX_W}" height="${h}" rx="${e.kind === 'ude' ? 4 : 10}"/>` +
      `<text class="id" x="${x + 10}" y="${y + 17}">${e.kind === 'ude' ? 'UDE · ' : e.kind === 'root' ? 'ROOT · ' : ''}${esc(e.id)}</text>` +
      `<text class="label" x="${x + 10}" y="${y + 33}">${text}</text></g>`
  })

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="ui-sans-serif, system-ui, sans-serif">
<style>
  :root{--fg:#1f1f1f;--dim:#6b6b6b;--bg:#ffffff;--edge:#555;--ude:#c2334d;--ude-bg:#fdecef;--root:#b7791f;--root-bg:#fdf3e1;--box:#f5f5f5;--and:#4f5bd5;--warn:#b7791f}
  @media (prefers-color-scheme: dark){:root{--fg:#e8e8e8;--dim:#9a9a9a;--bg:#1e1e1e;--edge:#aaa;--ude:#ff7a90;--ude-bg:#3a1f25;--root:#f2b84b;--root-bg:#3a3020;--box:#2a2a2a;--and:#9aa4ff;--warn:#f2b84b}}
  .bg{fill:var(--bg)} .title{fill:var(--fg);font-weight:600;font-size:14px} .hint{fill:var(--dim);font-size:11px}
  .node rect{fill:var(--box);stroke:var(--dim);stroke-width:1}
  .node.ude rect{fill:var(--ude-bg);stroke:var(--ude);stroke-width:1.6}
  .node.root rect{fill:var(--root-bg);stroke:var(--root);stroke-width:1.6}
  .id{fill:var(--dim);font-size:10.5px;font-weight:600;letter-spacing:.04em}
  .node.ude .id{fill:var(--ude)} .node.root .id{fill:var(--root)}
  .label{fill:var(--fg);font-size:12px}
  .edge{fill:none;stroke:var(--edge);stroke-width:1.3}
  .loop{fill:none;stroke:var(--warn);stroke-width:1.3;stroke-dasharray:5 4}
  .and{fill:none;stroke:var(--and);stroke-width:1.8}
  #arrow path{fill:var(--edge)} #arrow-loop path{fill:var(--warn)}
</style>
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker>
  <marker id="arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker>
</defs>
<rect class="bg" width="100%" height="100%"/>
<text class="title" x="${PAD}" y="${PAD + 4}">${esc(crt.title ?? 'Untitled CRT')}</text>
${edges.join('\n')}
${ands.join('\n')}
${nodes.join('\n')}
<text class="hint" x="${PAD}" y="${height - PAD + 6}">Read upward: if (below) then (above) · ellipse = AND (jointly sufficient)</text>
</svg>`
  return { svg, width, height }
}
