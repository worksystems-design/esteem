export type CrtSnapshot = {
  /** Where the block was found: a file path, "reply" or "prompt". */
  source: string
  /** The body of the esteem.crt fence. */
  text: string
}

/** How the pane draws the tree where the surface can draw SVG. */
export type CrtView = 'diagram' | 'tree'

declare module 'claude-code' {
  interface PluginState {
    'crt-pane': { current: CrtSnapshot | null; view: CrtView }
  }
}
