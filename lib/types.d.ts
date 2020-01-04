import estree from 'estree'

declare global {
  interface ASTNode extends estree.BaseNode {
    [_: string]: any
  }
}
