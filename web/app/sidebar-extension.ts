import type {Token, TokenizerAndRendererExtension} from 'marked'

export default {
  name: 'sidebarExtension',
  level: 'block',
  start(src: string) {
    return src.match(/^:/)?.index
  },
  tokenizer(src: string, tokens: Token[]) {
    const rule = /^((?::.*)(?:\n|$))+/
    const match = src.match(rule)
    if (match) {
      const processed = match[0]
        .trim()
        .split('\n')
        .map((line) => line.replace(/^:/, ''))
        .join('\n')
      const token = {
        type: 'sidebarExtension',
        raw: match[0],
        text: processed,
        tokens: [] as Token[],
      }
      token.tokens = this.lexer.blockTokens(token.text)
      return token
    }
  },
  renderer(token: any) {
    return (
      '\n<blockquote class="sidebar">' +
      this.parser.parse(token.tokens) +
      '</blockquote>'
    )
  },
} as TokenizerAndRendererExtension
