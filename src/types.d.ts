// Types
import type { TokenKind, TokenSpecifier, TokenType, TokenVariant} from './constants';


export interface Token {
  kind: TokenKind,
  value: string,
  start: number,
  end: number,
  length: number,
  type?: TokenType,
  specifier?: TokenSpecifier,
  param?: string,
  flags?: string,
  width?: string,
  precision?: string,
  fLength?: string,
  variant?: TokenVariant,
  case?: 'lower' | 'upper',
}
