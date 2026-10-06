import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { CrtSnapshot, CrtView } from '../types'
import { lastBlock, layout, parse } from './crt'
import { toSvg } from './svg'

const PANE = 'crt'
const current = atom({ plugin: 'crt-pane', key: 'current' } as const, null)
const view = atom({ plugin: 'crt-pane', key: 'view' } as const, 'diagram' as CrtView)

const show = async ($: EngineInterface, snap: CrtSnapshot) => {
  await update($, current, () => snap)
  $.ui.open({ id: PANE, title: 'Current Reality Tree' }).catch(() => undefined)
}

const scanFile = async ($: EngineInterface, path: string) => {
  if (!/\.md$/i.test(path)) return
  const text = await $.fs.read(path).catch(() => undefined)
  const block = text === undefined ? undefined : lastBlock(text)
  if (block !== undefined) await show($, { source: path, text: block })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'crt',
      description: 'Open the CRT pane; with a path, load the last esteem.crt block from that file',
      argumentHint: '[file.md]',
    })
    await $.tool.register({
      name: 'open',
      description:
        'Open the CRT side pane and report which surfaces (terminal, desktop, vscode, mobile) this session draws on, and whether a CRT is loaded.',
    })
    return next(e)
  })

  on('tool.call', { tool: 'mcp__crt-pane__open' }, async $ => {
    const surfaces = await $.session.surfaces()
    const snap = await read($, current)
    const opened = await $.ui
      .open({ id: PANE, title: 'Current Reality Tree' })
      .then(() => 'opened')
      .catch((err: unknown) => `not opened: ${String(err)}`)
    const text = [
      `surfaces: ${surfaces.length ? surfaces.join(', ') : 'none'}`,
      `pane: ${opened}`,
      `crt: ${snap === null ? 'none loaded' : `from ${snap.source}`}`,
    ].join('\n')
    return { result: text, text }
  })

  on('command.run', { command: 'crt' }, async ($, e) => {
    const path = e.args.trim()
    if (path === '') {
      await $.ui.open({ id: PANE, title: 'Current Reality Tree' })
      return { text: `CRT pane opened (surfaces: ${(await $.session.surfaces()).join(', ') || 'none'}).` }
    }
    const text = await $.fs.read(path).catch(() => undefined)
    if (text === undefined) return { text: `Cannot read ${path}.` }
    const block = lastBlock(text)
    if (block === undefined) return { text: `No esteem.crt block in ${path}.` }
    await show($, { source: path, text: block })
    return { text: `CRT from ${path} shown in the pane.` }
  })

  // A CRT written in a reply or pasted into a prompt.
  on('session.append', async ($, e, next) => {
    const stored = await next(e)
    if (e.agentId === undefined && (e.door === 'response' || e.door === 'prompt')) {
      const text = e.message.content
        .map(b => (b.type === 'text' && typeof b.text === 'string' ? b.text : ''))
        .join('\n')
      const block = lastBlock(text)
      if (block !== undefined)
        await show($, { source: e.door === 'response' ? 'reply' : 'prompt', text: block })
    }
    return stored
  }).catch(($, e, next) => next(e))

  // A CRT written or edited in a markdown file.
  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const ran = await next(e)
    if (!ran.isError) await scanFile($, e.file_path)
    return ran
  }).catch(($, e, next) => next(e))
  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    const ran = await next(e)
    if (!ran.isError) await scanFile($, e.file_path)
    return ran
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const snap = await read($, current)
    if (snap === null)
      return (
        <Box flexDirection="column">
          <Text dimColor>No CRT yet.</Text>
          <Text dimColor>Write an ```esteem.crt block, or run /crt file.md</Text>
        </Box>
      )

    const crt = parse(snap.text)
    const canDraw = e.surface !== 'terminal'
    const mode: CrtView = canDraw ? await read($, view) : 'tree'
    const problems = crt.problems.map(p => (
      <Text color="warning" wrap="truncate-end">⚠ {p}</Text>
    ))
    const toggle = canDraw ? (
      <Button
        key="view"
        label={mode === 'diagram' ? 'Show as tree' : 'Show as diagram'}
        onPress={() => update($, view, v => (v === 'diagram' ? 'tree' : 'diagram'))}
      />
    ) : null

    if (e.surface !== 'terminal' && mode === 'diagram') {
      const { Svg } = $.ui.resolve(e)
      const { svg } = toSvg(crt)
      const rows = layout(crt)
      const alt = rows
        .map(r => (r.type === 'node' ? `${r.prefix}${r.entity.id} ${r.entity.text}` : r.type === 'and' ? `${r.prefix}AND` : r.text))
        .join('\n')
      return (
        <Box flexDirection="column">
          <Box flexDirection="row" justifyContent="space-between">
            <Text dimColor wrap="truncate-middle">{snap.source}</Text>
            {toggle}
          </Box>
          <Svg source={svg} alt={alt} isInteractive />
          {problems}
        </Box>
      )
    }

    const rows = layout(crt)
    const glyph = { ude: '▲', root: '●', effect: '○' } as const
    const color = { ude: 'error', root: 'warning', effect: 'text' } as const

    return (
      <Box flexDirection="column">
        <Text bold wrap="truncate-end">{crt.title ?? 'Untitled CRT'}</Text>
        <Text dimColor wrap="truncate-middle">{snap.source}</Text>
        <Text dimColor>read upward: if (below) then (above)</Text>
        {toggle}
        <Text> </Text>
        {rows.map(row =>
          row.type === 'heading' ? (
            <Text dimColor italic>{`\n${row.text}`}</Text>
          ) : row.type === 'and' ? (
            <Text dimColor>{row.prefix}<Text color="suggestion" bold>AND</Text></Text>
          ) : (
            <Text wrap="truncate-end">
              <Text dimColor>{row.prefix}</Text>
              <Text color={color[row.entity.kind]}>{glyph[row.entity.kind]} </Text>
              <Text bold>{row.entity.id}</Text>
              {row.repeat === 'loop' ? (
                <Text color="warning"> ↻ loops back</Text>
              ) : row.repeat === 'seen' ? (
                <Text dimColor> ↑ see above</Text>
              ) : (
                <Text>{row.entity.text ? `  ${row.entity.text}` : ''}</Text>
              )}
            </Text>
          ),
        )}
        {problems.length > 0 && <Text> </Text>}
        {problems}
        <Text> </Text>
        <Text dimColor>▲ UDE  ○ effect  ● root cause</Text>
      </Box>
    )
  })
}
