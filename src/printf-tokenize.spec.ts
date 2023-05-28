// Core
import test, { ExecutionContext } from 'ava';
// Utils
import printfTokenize from './printf-tokenize.ts';
import {
  createLiteralToken,
  createSpecifierToken,
} from './helpers.ts';
// Types
import { TokenSpecifier } from './constants.ts';
import { Token } from './types';


const checkValueAndLength = (str: string, expectedTokens: Array<Token>) => expectedTokens.filter(token => {
  const value = str.substring(token.start, token.end);
  return value === token.value && value.length === token.length;
}).length === expectedTokens.length;

const validateTokens = (
  t: ExecutionContext,
  input: string,
  expectedTokens: Array<Token>
) => {
  t.deepEqual(printfTokenize(input), expectedTokens);
  t.true(checkValueAndLength(input, expectedTokens));
};

Object.entries({
  'Characters: %c %c ': [
    createLiteralToken(0, 'Characters: '),
    createSpecifierToken(TokenSpecifier.Character)(12, '%c'),
    createLiteralToken(14, ' '),
    createSpecifierToken(TokenSpecifier.Character)(15, '%c'),
    createLiteralToken(17, ' '),
  ],
  'Decimals: %d %ld': [
    createLiteralToken(0, 'Decimals: '),
    createSpecifierToken(TokenSpecifier.Digit)(10, '%d'),
    createLiteralToken(12, ' '),
    createSpecifierToken(TokenSpecifier.Digit)(13, '%ld', undefined, undefined, undefined, undefined, 'l'),
  ],
  'Decimals: with a scaped format %d%% due percent': [
    createLiteralToken(0, 'Decimals: with a scaped format '),
    createSpecifierToken(TokenSpecifier.Digit)(31, '%d'),
    createLiteralToken(33, '%% due percent'),
  ],
  'Preceding with blanks: %10d ': [
    createLiteralToken(0, 'Preceding with blanks: '),
    createSpecifierToken(TokenSpecifier.Digit)(23, '%10d', undefined, undefined, '10'),
    createLiteralToken(27, ' '),
  ],
  'Preceding with zeros: %010d ': [
    createLiteralToken(0, 'Preceding with zeros: '),
    createSpecifierToken(TokenSpecifier.Digit)(22, '%010d', undefined, '0', '10'),
    createLiteralToken(27, ' '),
  ],
  'Some different radices: %d %x %o %#x %#o ': [
    createLiteralToken(0, 'Some different radices: '),
    createSpecifierToken(TokenSpecifier.Digit)(24, '%d'),
    createLiteralToken(26, ' '),
    createSpecifierToken(TokenSpecifier.Hexadecimal)(27, '%x'),
    createLiteralToken(29, ' '),
    createSpecifierToken(TokenSpecifier.Octal)(30, '%o'),
    createLiteralToken(32, ' '),
    createSpecifierToken(TokenSpecifier.Hexadecimal)(33, '%#x', undefined, '#'),
    createLiteralToken(36, ' '),
    createSpecifierToken(TokenSpecifier.Octal)(37, '%#o', undefined, '#'),
    createLiteralToken(40, ' '),
  ],
  'floats: %4.2f %+.0e %E ': [
    createLiteralToken(0, 'floats: '),
    createSpecifierToken(TokenSpecifier.Float)(8, '%4.2f', undefined, undefined, '4', '2'),
    createLiteralToken(13, ' '),
    createSpecifierToken(TokenSpecifier.Scientific)(14, '%+.0e', undefined, '+', undefined, '0'),
    createLiteralToken(19, ' '),
    createSpecifierToken(TokenSpecifier.ScientificUpper)(20, '%E'),
    createLiteralToken(22, ' '),
  ],
  'Width trick: %*d ': [
    createLiteralToken(0, 'Width trick: '),
    createSpecifierToken(TokenSpecifier.Digit)(13, '%*d', undefined, undefined, '*'),
    createLiteralToken(16, ' '),
  ],
  '%s ': [
    createSpecifierToken(TokenSpecifier.String)(0, '%s'),
    createLiteralToken(2, ' '),
  ],
}).forEach((spec) => {
  test(`should tokenize the input "${spec[0]}"`, (t) => validateTokens(t, spec[0], spec[1]));
});


test.todo('should works with multiline format');
