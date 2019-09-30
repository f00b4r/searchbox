/**
 * Search box configuration options.
 */
interface SearchBoxOptions {
  /**
   * Keywords (variables) to look for in the user input.
   *
   * By default no keywords are defined and everything is considered
   * a fulltext search.
   */
  keywords?: string[],
}

/**
 * Search literal is a triplet of key, value and an optional operator.
 */
interface Literal {
  key: string,
  values: string[],
  op?: Operator,
}

/**
 * Operator is usually a single-char prefixing a literal.
 */
type Operator = string;

/**
 * Lexer token is a smallest bit of information that a Lexer can produce.
 */
interface LexerToken {
  type: string,
  value: string,
}

/**
 * Callback for consuming lexer tokens.
 */
type LexerTokenHandler = (token: LexerToken) => void;
