import { expect, test } from 'claude-code/testing'

import { lastBlock, layout, parse } from '../hooks/crt'
import { toSvg } from '../hooks/svg'

const SRC = `# title: Late deliveries
entities:
  ude1 [ude]: Customers receive orders late
  c1: Warehouse picks strictly FIFO
  c2: Urgent orders are not flagged
  rc1 [root]: No priority rules defined
  rc2 [root]: Order form has no urgency field
links:
  c1 → ude1
  rc1 & c2 -> c1
  rc2 → c2
`

test('parses entities, AND groups and title', async () => {
  const crt = parse(SRC)
  expect(crt.title).toBe('Late deliveries')
  expect(crt.entities.size).toBe(5)
  expect(crt.causes.get('c1')).toEqual([['rc1', 'c2']])
  expect(crt.problems).toEqual([])
})

test('lays out UDE on top with an AND junction', async () => {
  const rows = layout(parse(SRC))
  const lines = rows.map(r => (r.type === 'node' ? r.prefix + r.entity.id : r.type === 'and' ? r.prefix + 'AND' : r.text))
  expect(lines).toEqual(['ude1', '└─ c1', '   └─ AND', '      ├─ rc1', '      └─ c2', '         └─ rc2'])
})

test('flags unknown ids and loops', async () => {
  const crt = parse('entities:\n  a [ude]: A\n  b: B\nlinks:\n  b → a\n  a → b\n  x → a\n')
  expect(crt.problems.some(p => p.includes('"x"'))).toBe(true)
  expect(layout(crt).some(r => r.type === 'node' && r.repeat === 'loop')).toBe(true)
})

test('finds the last esteem.crt block', async () => {
  const md = 'x\n```esteem.crt\nfirst\n```\n```esteem.cld\nno\n```\n```esteem.crt\nsecond\n```\n'
  expect(lastBlock(md)).toBe('second\n')
})

test('a UDE feeding another UDE is not drawn twice', async () => {
  const crt = parse('entities:\n  u1 [ude]: A\n  u2 [ude]: B\n  r [root]: R\nlinks:\n  u2 → u1\n  r → u2\n')
  const ids = layout(crt).flatMap(r => (r.type === 'node' ? [r.prefix + r.entity.id] : []))
  expect(ids).toEqual(['u1', '└─ u2', '   └─ r'])
})

test('diagram is valid SVG with one box per entity and an AND ellipse', async () => {
  const { svg } = toSvg(parse(SRC))
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg.match(/<rect x=/g)?.length).toBe(5)
  expect(svg.match(/<ellipse/g)?.length).toBe(1)
  expect(svg.length).toBeLessThan(131072)
})
