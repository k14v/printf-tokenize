// Utils
import {
  createLiteralToken,
  createSpecifierToken,
} from './helpers.ts';
// Types
import { TokenSpecifier } from './constants.ts';


// credits https://github.com/SheetJS/printj/blob/master/lib/loop_code.mjs
function printfTokenize (fmt: string) {
  const out = [];
  let start = 0;

  let i = 0;
  let infmt = false;
  let fmtparam = '';


  let fmtflags = '';
  let fmtwidth = '';
  let fmtprec = '';
  let fmtlen = '';
  let c = 0;
  const L = fmt.length;
  let specifier;
  let createToken;

  for (; i < L; ++i) {
    c = fmt.charCodeAt(i);
    if (!infmt) {
      if (c !== 37 || (
        // Escape percent using %%
        c === 37 && (
          fmt.charCodeAt(i - 1) === 37 ||
          fmt.charCodeAt(i + 1) === 37
        )
      )) continue;
      if (start < i) out.push(createLiteralToken(start, fmt.substring(start, i)));
      start = i;
      infmt = true;
      continue;
    }

    if (c >= 48 && c < 58) {
      if (fmtprec.length) fmtprec += String.fromCharCode(c);
      else if (c === 48 && !fmtwidth.length) fmtflags += String.fromCharCode(c);
      else fmtwidth += String.fromCharCode(c);
    } else {
      switch (c) {
      /* positional */
        case 36:
          if (fmtprec.length) {
            fmtprec += '$';
          } else if (fmtwidth.charAt(0) === '*') {
            fmtwidth += '$';
          } else {
            fmtparam = fmtwidth + '$';
            fmtwidth = '';
          }
          break;

        /* flags */
        case 39:
          fmtflags += "'";
          break;
        case 45:
          fmtflags += '-';
          break;
        case 43:
          fmtflags += '+';
          break;
        case 32:
          fmtflags += ' ';
          break;
        case 35:
          fmtflags += '#';
          break;

        /* width and precision */
        case 46:
          fmtprec = '.';
          break;
        case 42:
          if (fmtprec.charAt(0) === '.') {
            fmtprec += '*';
          } else {
            fmtwidth += '*';
          };
          break;

        /* length */
        case 104:
        case 108:
          if (fmtlen.length > 1) {
            throw new Error('bad length ' + fmtlen + String(c));
          };
          fmtlen += String.fromCharCode(c);
          break;

        case 76:
        case 106:
        case 122:
        case 116:
        case 113:
        case 90:
        case 119:
          if (fmtlen !== '') {
            throw new Error('bad length ' + fmtlen + String.fromCharCode(c));
          };
          fmtlen = String.fromCharCode(c);
          break;

        case 73:
          if (fmtlen !== '') {
            throw new Error('bad length ' + fmtlen + 'I');
          };
          fmtlen = 'I';
          break;

        /* conversion */
        case 100:
        case 105:
        case 111:
        case 117:
        case 120:
        case 88:
        case 102:
        case 70:
        case 101:
        case 69:
        case 103:
        case 71:
        case 97:
        case 65:
        case 99:
        case 67:
        case 115:
        case 83:
        case 112:
        case 110:
        case 68:
        case 85:
        case 79:
        case 109:
        case 98:
        case 66:
        case 121:
        case 89:
        case 74:
        case 86:
        case 84:
        case 37:
          infmt = false;
          if (fmtprec.length > 1) {
            fmtprec = fmtprec.substr(1);
          };

          specifier = String.fromCharCode(c);
          createToken = createSpecifierToken(specifier as TokenSpecifier);

          out.push(createToken(start, fmt.substring(start, i + 1), fmtparam, fmtflags, fmtwidth, fmtprec, fmtlen));
          start = i + 1;
          fmtlen = fmtprec = fmtwidth = fmtflags = fmtparam = '';
          break;
        default:
          throw new Error(`Invalid format string starting with "${fmt.substring(start, i + 1)}"`);
      }
    }
  }

  if (start < fmt.length) {
    out.push(createLiteralToken(start, fmt.substring(start)));
  };
  return out;
};

export default printfTokenize;
