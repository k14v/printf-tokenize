import test from 'ava';
import printfTokenize from '../src/printf-tokenize';
import {
  createLiteralToken,
  createSpecifierToken,
} from './helpers';


const checkValueAndLength = (str, expectedTokens) => expectedTokens.filter(token => {
  const value = str.substring(token.start, token.end);
  return value === token.value && value.length === token.length;
}).length === expectedTokens.length;

const validateTokens = (t, input, expectedTokens) => {
  t.deepEqual(printfTokenize(input), expectedTokens);
  t.true(checkValueAndLength(input, expectedTokens));
};

Object.entries({
  'Characters: %c %c ': [
    createLiteralToken(0, 'Characters: '),
    createSpecifierToken('c')(12, '%c'),
    createLiteralToken(14, ' '),
    createSpecifierToken('c')(15, '%c'),
    createLiteralToken(17, ' '),
  ],
  'Decimals: %d %ld': [
    createLiteralToken(0, 'Decimals: '),
    createSpecifierToken('d')(10, '%d'),
    createLiteralToken(12, ' '),
    createSpecifierToken('d')(13, '%ld', null, null, null, null, 'l'),
  ],
  'Preceding with blanks: %10d ': [
    createLiteralToken(0, 'Preceding with blanks: '),
    createSpecifierToken('d')(23, '%10d', null, null, '10'),
    createLiteralToken(27, ' '),
  ],
  'Preceding with zeros: %010d ': [
    createLiteralToken(0, 'Preceding with zeros: '),
    createSpecifierToken('d')(22, '%010d', null, '0', '10'),
    createLiteralToken(27, ' '),
  ],
  'Some different radices: %d %x %o %#x %#o ': [
    createLiteralToken(0, 'Some different radices: '),
    createSpecifierToken('d')(24, '%d'),
    createLiteralToken(26, ' '),
    createSpecifierToken('x')(27, '%x'),
    createLiteralToken(29, ' '),
    createSpecifierToken('o')(30, '%o'),
    createLiteralToken(32, ' '),
    createSpecifierToken('x')(33, '%#x', null, '#'),
    createLiteralToken(36, ' '),
    createSpecifierToken('o')(37, '%#o', null, '#'),
    createLiteralToken(40, ' '),
  ],
  'floats: %4.2f %+.0e %E ': [
    createLiteralToken(0, 'floats: '),
    createSpecifierToken('f')(8, '%4.2f', null, null, '4', '2'),
    createLiteralToken(13, ' '),
    createSpecifierToken('e')(14, '%+.0e', null, '+', null, '0'),
    createLiteralToken(19, ' '),
    createSpecifierToken('E')(20, '%E'),
    createLiteralToken(22, ' '),
  ],
  'Width trick: %*d ': [
    createLiteralToken(0, 'Width trick: '),
    createSpecifierToken('d')(13, '%*d', null, null, '*'),
    createLiteralToken(16, ' '),
  ],
  '%s ': [
    createSpecifierToken('s')(0, '%s'),
    createLiteralToken(2, ' '),
  ],
}).forEach((spec) => {
  test(`should tokenize the input "${spec[0]}"`, (t) => validateTokens(t, spec[0], spec[1]));
});

test.todo('should works with multiline format');
