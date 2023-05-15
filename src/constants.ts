export enum TokenKind {
  Parameter = 'Parameter',
  Literal = 'Literal',
}

export enum TokenType {
  Character = 'Character',
  String = 'String',
  Number = 'Number',
}

export enum TokenVariant {
  Hexadecimal = 'Hexadecimal',
  Octal = 'Octal',
  Integer = 'Integer',
  Float = 'Float',
  Scientific = 'Scientific',
}

export enum TokenSpecifier {
  Character = 'c',
  String = 's',
  Octal = 'o',
  Digit = 'd',
  Integer = 'i',
  Float = 'f',
  Hexadecimal = 'x',
  HexadecimalUpper = 'X',
  Scientific = 'e',
  ScientificUpper = 'E',
}
