# printf-tokenize
Javascript printf tokenize creates a array of tokens using the standard from `cplusplus` http://www.cplusplus.com/reference/cstdio/printf/ to parse flags.

```javascript
const tokenize = require('@k14v/printf-tokenize')

tokenize('This is %s test with %d flags')

/*
[ { type: 'Literal', value: 'This is ', start: 0, end: 8, length: 8 },
  { type: 'Parameter',
    value: '%s',
    start: 8,
    end: 10,
    length: 2,
    kind: 'String',
    specifier: 's' },
  { type: 'Literal',
    value: ' test with ',
    start: 10,
    end: 21,
    length: 11 },
  { type: 'Parameter',
    value: '%d',
    start: 21,
    end: 23,
    length: 2,
    kind: 'Number',
    specifier: 'd',
    variant: 'Integer' },
  { type: 'Literal', value: ' flags', start: 23, end: 29, length: 6 } ]
*/
```
