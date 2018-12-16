import {
  TOKEN_TYPES,
  TOKEN_KIND_TYPES,
  TOKEN_VARIANT_TYPES
} from './constants'

export const filterProps = (props) => Object
  .entries(props)
  .filter(entry => !!entry[1])
  .reduce((prev, entry) => ({
    ...prev,
    [entry[0]]: entry[1]
  }), {})

export const createToken = (type, start, value, extra) => ({
  type,
  value,
  start,
  end: start + value.length,
  length: value.length,
  ...extra
});

export const createParameterToken = (kind, extra) => specifier => (
  start,
  value,
  param,
  flags,
  width,
  precision,
  flength
) => createToken(
  TOKEN_TYPES.PARAMETER,
  start,
  value,
  filterProps({
    kind,
    specifier,
    param,
    flags,
    width,
    precision,
    flength,
    ...extra
  }))

export const createLiteralToken = (start, value, extra) => createToken(
  TOKEN_TYPES.LITERAL,
  start,
  value,
  extra
);

export const createNumberToken = (variant, extra) => createParameterToken(
  TOKEN_KIND_TYPES.NUMBER, {
    variant,
    ...extra
  })


export const SPECIFIERS_TOKEN_MAP = {
  'c': createParameterToken(
    TOKEN_KIND_TYPES.CHARACTER),
  's': createParameterToken(
    TOKEN_KIND_TYPES.STRING),
  'o': createNumberToken(
    TOKEN_VARIANT_TYPES.OCTAL),
  'd': createNumberToken(
    TOKEN_VARIANT_TYPES.INTEGER),
  'i': createNumberToken(
    TOKEN_VARIANT_TYPES.INTEGER),
  'f': createNumberToken(
    TOKEN_VARIANT_TYPES.FLOAT),
  'x': createNumberToken(
    TOKEN_VARIANT_TYPES.HEXADECIMAL, {
    case: 'lower'
  }),
  'X': createNumberToken(
    TOKEN_VARIANT_TYPES.HEXADECIMAL, {
    case: 'upper'
  }),
  'e': createNumberToken(
    TOKEN_VARIANT_TYPES.SCIENTIFIC, {
    case: 'lower'
  }),
  'E': createNumberToken(
    TOKEN_VARIANT_TYPES.SCIENTIFIC, {
    case: 'upper'
  }),
}


export const createSpecifierToken = specifier => {
  const createToken = SPECIFIERS_TOKEN_MAP[specifier];
  if (typeof createToken !== 'function') {
    throw new Error(`Invalid specifier: "${specifier}"`)
  }
  return createToken(specifier)
}
