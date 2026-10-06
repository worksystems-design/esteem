import { expect, test } from 'claude-code/testing'

const PANE = {
  title: 'Current Reality Tree',
  isFocused: false,
  bodyColumns: 60,
  placement: 'dock' as const,
  scroll: { offset: 0, bodyRows: 40 },
  view: {},
}
const SRC = 'entities:\n  ude1 [ude]: Orders late\n  rc1 [root]: No rules\nlinks:\n  rc1 → ude1\n'

test('/crt <file> draws its CRT on every surface', async ($, on) => {
  on('fs.read', async () => ({ value: '# Notes\n\n```esteem.crt\n' + SRC + '```\n' }))
  const ran = await $.command.run({ command: 'crt', args: 'notes.md' })
  expect(ran.text).toContain('notes.md')
  for (const surface of ['terminal', 'desktop', 'mobile'] as const) {
    const ui = await $.ui.mount({ plugin: 'crt-pane', surface, component: 'Pane', requestId: 'crt', props: PANE })
    if (surface === 'terminal') {
      expect(await ui.find({ type: 'Text', text: /Orders late/ })).toBeDefined()
      expect(await ui.find({ type: 'Text', text: /rc1/ })).toBeDefined()
    } else {
      expect(await ui.find({ type: 'Svg' })).toBeDefined()
      await ui.press({ key: 'view' })
      expect(await ui.find({ type: 'Text', text: /Orders late/ })).toBeDefined()
      await ui.press({ key: 'view' })
    }
    await ui.unmount()
  }
})

test('pane shows a hint when empty', async $ => {
  const ui = await $.ui.mount({ plugin: 'crt-pane', surface: 'terminal', component: 'Pane', requestId: 'crt', props: PANE })
  expect(await ui.find({ type: 'Text', text: /No CRT yet/ })).toBeDefined()
  await ui.unmount()
})
