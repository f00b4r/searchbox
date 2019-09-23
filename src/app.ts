import {Lexer, Parser} from '.';
import * as assert from "assert";


const parser = new Parser();
const lexer = new Lexer(['title', 'author', 'text'], parser.parse.bind(parser));

const inputText = 'Foo bar title:hello author:joe -text:"foo bar" text:baz perex:\'naughty:naughty:monkey\' -trailer';
lexer.lex(inputText);

const formula = parser.getFormula();
console.log(formula.toString());

// Quick test:
assert.strictEqual(formula.getLiterals()[0].toString(), 'fulltext: [Foo,bar,perex,:\',naughty,:,naughty,:,monkey,\' -,trailer]');
assert.strictEqual(formula.getLiterals()[1].toString(), 'title: [hello]');
assert.strictEqual(formula.getLiterals()[2].toString(), 'author: [joe]');
assert.strictEqual(formula.getLiterals()[3].toString(), '-text: [foo bar]');
assert.strictEqual(formula.getLiterals()[4].toString(), 'text: [baz]');
