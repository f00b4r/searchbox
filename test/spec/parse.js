const searchbox = require('./../../dist');

test('parses query with all keywords and operators', () => {
  const inputText = 'Foo bar title:hello author:joe -text:"foo bar" text:baz perex:\'naughty:naughty:monkey\' -trailer';
  const keywords = ['title', 'author', 'text'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(5);
});