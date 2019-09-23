import moo = require("moo");

const TOKEN_OP = 'OP';
const TOKEN_KEY = 'KEY';
const TOKEN_VALUE = 'VALUE';
const TOKEN_FULLTEXT = 'FULLTEXT';

export class Formula {

    private literals: Literal[] = [];

    public append(key: string, value: string, op?: string) {
        let literal = this.literals
            .filter(literal => literal.key === key)
            .find(literal => literal.op === op);

        if (!literal) {
            literal = new Literal(key, [], op);
            this.literals.push(literal);
        }

        literal.values.push(value);
    }

    public getLiterals(): Literal[] {
        return this.literals;
    }

    public toString(): string {
        return 'Formula:\n' + this.literals
            .map(literal => ' ' + literal.toString())
            .join("\n");
    }
}

export type Operator = string | undefined;

export class Literal {

    public constructor(public key: string, public values: string[], public op?: Operator) {
    }

    public toString(): string {
        return `${this.op ? this.op : ''}${this.key}: [${this.values}]`;
    }

}

/**
 * Parser: parses tokens into a structured formula.
 */
export class Parser {

    private query: Formula = new Formula();
    private lastOp?: string;
    private lastKey?: string;

    public getFormula(): Formula {
        return this.query;
    }

    public reset() {
        this.query = new Formula();
    }

    public parse(token: Token): void {
        console.debug(`Parsing token #${token.type}# : #${token.value}#`);

        switch (token.type) {
            case TOKEN_OP:
                this.lastOp = token.value;
                break;

            case TOKEN_KEY:
                this.lastKey = token.value;
                break;

            case TOKEN_VALUE:
                this.append(this.lastKey!, token.value, this.lastOp);
                this.lastOp = undefined;
                this.lastKey = undefined;
                break;

            case TOKEN_FULLTEXT:
                this.append('fulltext', token.value);
                break;
        }
    }

    private append(key: string, value: string, op?: string) {
        this.query.append(key, value, op);
    }
}

/**
 * Lexer: tokenizer of user input into tokens (lexemes).
 */
export class Lexer {

    private readonly lexer: moo.Lexer;
    private readonly handler: TokenHandler;

    public constructor(keywords: string[], handler: TokenHandler) {
        const operators = ['-'];
        this.handler = handler;

        // Define our grammar.
        const WS = /[ \t]+/;
        const OP = new RegExp(`${operators.join('|')}(?=(?:${keywords.join('|')}))`);
        const SEP = /:/;
        const WORD = /[\w]+/;
        const WORDS_SQ = /'.*?'/;
        const WORDS_DQ = /".*?"/;
        const NON_WORD = /\W+/;

        // Define stateful grammar rules.
        this.lexer = moo.states({
            // Initial state: primarily we match keywords and operators here. The rest is fulltext.
            init: {
                WS: WS,
                [TOKEN_OP]: {match: OP},
                [TOKEN_KEY]: {
                    match: keywords,
                    type: moo.keywords({KEY: keywords}),
                    push: 'pair'
                },
                [TOKEN_FULLTEXT]: [
                    {match: WORDS_SQ, value: x => x.slice(1, -1)},
                    {match: WORDS_DQ, value: x => x.slice(1, -1)},
                    {match: WORD},
                    {match: NON_WORD, lineBreaks: true},
                ],
            },

            // Pair state: If a keyword was matched, look for the value and move back to init.
            pair: {
                SEP: {match: SEP},
                [TOKEN_VALUE]: [
                    {match: WORDS_SQ, value: x => x.slice(1, -1), pop: 1},
                    {match: WORDS_DQ, value: x => x.slice(1, -1), pop: 1},
                    {match: WORD, pop: 1},
                ],
            },
        });
    }

    public lex(input: string): void {
        this.lexer.reset(input);
        let token = this.lexer.next();

        while (token !== undefined) {
            switch (token.type) {
                case TOKEN_OP:
                case TOKEN_KEY:
                case TOKEN_VALUE:
                case TOKEN_FULLTEXT:
                    this.emitTerm(token.type, token.value);
                    break;
            }

            token = this.lexer.next();
        }
    }

    protected emitTerm(type: string, value: string): void {
        this.handler({type, value});
    }
}

type Token = {
    type: string,
    value: string,
}

type TokenHandler = (term: Token) => void;
