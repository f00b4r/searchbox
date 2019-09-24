import searchbox from '.';
import * as assert from "assert";

// Quick test:
const inputText = 'Foo bar title:hello author:joe -text:"foo bar" text:baz perex:\'naughty:naughty:monkey\' -trailer';
const keywords = ['title', 'author', 'text'];

const formula = searchbox.parse(inputText, {keywords});
console.log(formula.toString());

assert.strictEqual(formula.getLiterals()[0].key, 'fulltext');
assert.deepStrictEqual(formula.getLiterals()[0].values, ['Foo', 'bar', 'perex', ':\'', 'naughty', ':', 'naughty', ':', 'monkey', '\' -', 'trailer']);
assert.strictEqual(formula.getLiterals()[0].op, undefined);

assert.strictEqual(formula.getLiterals()[1].key, 'title');
assert.deepStrictEqual(formula.getLiterals()[1].values, ['hello']);
assert.strictEqual(formula.getLiterals()[1].op, undefined);

assert.strictEqual(formula.getLiterals()[2].key, 'author');
assert.deepStrictEqual(formula.getLiterals()[2].values, ['joe']);
assert.strictEqual(formula.getLiterals()[2].op, undefined);

assert.strictEqual(formula.getLiterals()[3].key, 'text');
assert.deepStrictEqual(formula.getLiterals()[3].values, ['foo bar']);
assert.strictEqual(formula.getLiterals()[3].op, '-');

assert.strictEqual(formula.getLiterals()[4].key, 'text');
assert.deepStrictEqual(formula.getLiterals()[4].values, ['baz']);
assert.strictEqual(formula.getLiterals()[4].op, undefined);
