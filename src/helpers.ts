import {
  TokenKind,
  TokenVariant,
  TokenSpecifier,
  TokenType,
} from './constants';
// Types
import type { Token } from './index';


export function filterToken (props: Partial<Token>): Partial<Token> {
  return Object.entries(props)
    .filter(entry => Boolean(entry[1]))
    .reduce((prev: Partial<Token>, entry) => ({...prev, [entry[0]]: entry[1]}), {} as Partial<Token>)
}

export function createToken (
  kind: TokenKind,
  start: number,
  value: string,
  extra?: Partial<Token>
): Token {
  return {
    kind,
    value,
    start,
    end: start + value.length,
    ...extra,
  } as Token;
}

export function createParameterToken (type: TokenType, extra?: Partial<Token>) {
  return (specifier: TokenSpecifier) => (
    start: number,
    value: string,
    param: string,
    flags: string,
    width: string,
    precision: string,
    fLength: string,
  ) => createToken(
    TokenKind.Parameter,
    start,
    value,
    filterToken({
      type,
      specifier,
      param,
      flags,
      width,
      precision,
      fLength,
      ...extra,
    })
  );
}

export function createLiteralToken (start: number, value: string, extra?: Partial<Token>): Token {
  return createToken(
    TokenKind.Literal,
    start,
    value,
    extra
  )
}

export function createNumberToken (variant: TokenVariant, extra?: Partial<Token>) {
  return createParameterToken(TokenType.Number, {variant, ...extra})
}

export const SPECIFIERS_TOKEN_MAP = {
  [TokenSpecifier.Character]: createParameterToken(TokenType.Character),
  [TokenSpecifier.String]: createParameterToken(TokenType.String),
  [TokenSpecifier.Octal]: createNumberToken(TokenVariant.Octal),
  [TokenSpecifier.Digit]: createNumberToken(TokenVariant.Integer),
  [TokenSpecifier.Integer]: createNumberToken(TokenVariant.Integer),
  [TokenSpecifier.Float]: createNumberToken(TokenVariant.Float),
  [TokenSpecifier.Hexadecimal]: createNumberToken(TokenVariant.Hexadecimal, { case: 'lower' }),
  [TokenSpecifier.HexadecimalUpper]: createNumberToken(TokenVariant.Hexadecimal, { case: 'upper' }),
  [TokenSpecifier.Scientific]: createNumberToken(TokenVariant.Scientific, { case: 'lower' }),
  [TokenSpecifier.ScientificUpper]: createNumberToken(TokenVariant.Scientific, { case: 'upper' }),
};

export function createSpecifierToken (specifier: TokenSpecifier) {
  const createToken = SPECIFIERS_TOKEN_MAP[specifier];
  if(typeof createToken !== 'function') {
    throw new Error(`Invalid specifier: "${specifier}"`);
  }
  return createToken(specifier)
}
