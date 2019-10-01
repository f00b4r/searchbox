import MooLexer = require('moo');

const TYPE_OP = 'OP';
const TYPE_SEP = 'SEP';
const TYPE_KEY = 'KEY';
const TYPE_WORD = 'WORD';

const TYPE_CHAIN_PAIR = [TYPE_KEY, TYPE_SEP, TYPE_WORD].join('|');
const TYPE_CHAIN_OP_PAIR = [TYPE_OP, TYPE_KEY, TYPE_SEP, TYPE_WORD].join('|');

const KEY_UNDEFINED = '_';

export {
  KEY_UNDEFINED,
  parse,
}

/**
 * Parses a given user input into a structured formula.
 *
 * @param input searchbox input to parse
 * @param opts searchbox options
 */
function parse(input: string, opts?: SearchBoxOptions): Formula {
  const keywords = opts ? (opts.keywords || []) : [];

  const parser = new Parser();
  const lexer = new Lexer(keywords, parser.addToken.bind(parser));

  lexer.lex(input);
  return parser.parse();
}

/**
 * Formula contains a list of literals.
 */
class Formula {

  private literals: Literal[] = [];

  public append(key: string, value: string, op?: string) {
    let literal = this.literals
      .filter(literal => literal.key === key)
      .find(literal => literal.op === op);

    if (!literal) {
      literal = {key, op, values: []};
      this.literals.push(literal);
    }

    literal.values.push(value);
  }

  public getLiterals(): Literal[] {
    return this.literals;
  }

  public toString(): string {
    return 'Formula:\n' + this.literals
      .map(literal => ` ${literal.op ? literal.op : ''}${literal.key}: [${literal.values}]`)
      .join("\n");
  }
}

/**
 * Parser: parses tokens into a structured formula.
 */
class Parser {

  private formula: Formula = new Formula();
  private tokens: LexerToken[] = [];

  public addToken(token: LexerToken): void {
    // console.debug(`Parsing token #${token.type}# : #${token.value}#`);
    this.tokens.push(token);
  }

  public parse(): Formula {
    let tupleSize: number;

    for (let i = 0; i < this.tokens.length; i += tupleSize) {
      const t1 = this.tokens[i];
      const t2 = i + 1 < this.tokens.length ? this.tokens[i + 1] : undefined;
      const t3 = i + 2 < this.tokens.length ? this.tokens[i + 2] : undefined;
      const t4 = i + 3 < this.tokens.length ? this.tokens[i + 3] : undefined;

      tupleSize = this.parseTuple(t1, t2, t3, t4);
    }

    return this.formula;
  }

  private parseTuple(t1: LexerToken, t2?: LexerToken, t3?: LexerToken, t4?: LexerToken): number {
    const t1Type = t1.type;
    const t2Type = t2 ? t2.type : undefined;
    const t3Type = t3 ? t3.type : undefined;
    const t4Type = t4 ? t4.type : undefined;

    const typeChain = [t1Type, t2Type, t3Type, t4Type].join('|');

    if (typeChain.startsWith(TYPE_CHAIN_PAIR)) {
      this.append(t1.value, t3!.value);
      return 3;
    } else if (typeChain.startsWith(TYPE_CHAIN_OP_PAIR)) {
      this.append(t2!.value, t4!.value, t1.value);
      return 4;
    } else {
      this.append(KEY_UNDEFINED, t1.value);
      return 1;
    }
  }

  private append(key: string, value: string, op?: string) {
    this.formula.append(key, value, op);
  }
}

/**
 * Lexer: tokenizer of user input into tokens (lexemes).
 */
class Lexer {

  private readonly lexer: MooLexer.Lexer;
  private readonly handler: LexerTokenHandler;

  public constructor(keywords: string[], handler: LexerTokenHandler) {
    this.handler = handler;

    // Define supported operators.
    const operators = ['-'];

    // Define our (unicode) vocabulary.
    const WS = /[ \t]+/u;
    const OP = new RegExp(`${operators.join('|')}(?=(?:${keywords.join('|')}))`, 'u');
    const SEP = /:/u;
    const WORD = new RegExp("(?<=^|[ \f\n\r\t\v.,'\"+\\-!?:]+)(?:.+?)(?=$|[ \f\n\r\t\v.,'\"\+\\-!?:;]+)", "u");
    const WORDS_SQ = /'.*?'/u;
    const WORDS_DQ = /".*?"/u;
    const NON_WORD = /\W+?/u;

    // Define grammar rules.
    this.lexer = MooLexer.compile({
      WS: WS,
      [TYPE_OP]: {match: OP},
      [TYPE_SEP]: {match: SEP},
      [TYPE_WORD]: [
        {match: WORDS_SQ, value: x => x.slice(1, -1)},
        {match: WORDS_DQ, value: x => x.slice(1, -1)},
        {match: WORD, type: MooLexer.keywords({[TYPE_KEY]: keywords})},
      ],
      NON_WORD: {match: NON_WORD, lineBreaks: true},
    });
  }

  public lex(input: string): void {
    this.lexer.reset(input);
    let token = this.lexer.next();

    while (token !== undefined) {
      switch (token.type) {
        case TYPE_OP:
        case TYPE_SEP:
        case TYPE_KEY:
        case TYPE_WORD:
          this.emitToken(token.type, token.value);
          break;
      }

      token = this.lexer.next();
    }
  }

  protected emitToken(type: string, value: string): void {
    this.handler({type, value});
  }
}
