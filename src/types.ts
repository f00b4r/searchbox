/**
 * Search box configuration options.
 */
export interface SearchBoxOptions {
  /**
   * Keywords (variables) to look for in the user input.
   *
   * By default no keywords are defined and everything is considered
   * "undefined" (aka fulltext) search and will be accessible in the
   * result under {@link KEY_UNDEFINED}.
   */
  keywords?: string[],
}

/**
 * Search literal is a triplet of key, value and an optional operator.
 */
export interface Literal {
  key: string,
  values: string[],
  op?: Operator,
}

/**
 * Operator is usually a single-char prefixing a literal.
 */
export type Operator = string;

/**
 * Lexer token is a smallest bit of information that a Lexer can produce.
 */
export interface LexerToken {
  type: string,
  value: string,
}

/**
 * Callback for consuming lexer tokens.
 */
export type LexerTokenHandler = (token: LexerToken) => void;
