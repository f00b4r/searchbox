const searchbox = require('./../../dist');

test('parse simple query', () => {
  const inputText = 'Never take title:raisins from -author:rabbits';
  const keywords = ['title', 'author'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(3);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(3);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Never", "take", "from"
  ]));

  expect(literals[1].key).toBe('title');
  expect(literals[1].op).toBe(undefined);
  expect(literals[1].values).toHaveLength(1);
  expect(literals[1].values).toStrictEqual(expect.arrayContaining(['raisins']));

  expect(literals[2].key).toBe('author');
  expect(literals[2].op).toBe('-');
  expect(literals[2].values).toHaveLength(1);
  expect(literals[2].values).toStrictEqual(expect.arrayContaining(['rabbits']));
});

test('parse query with all keywords and operators', () => {
  const inputText = 'Foo bar title:hello author:joe -text:"foo bar" text:baz perex:\'naughty:naughty:monkey\' -trailer';
  const keywords = ['title', 'author', 'text'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(5);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(6);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Foo", "bar", "perex", ":", "naughty:naughty:monkey", "-trailer"
  ]));

  expect(literals[1].key).toBe('title');
  expect(literals[1].op).toBe(undefined);
  expect(literals[1].values).toHaveLength(1);
  expect(literals[1].values).toStrictEqual(expect.arrayContaining(['hello']));

  expect(literals[2].key).toBe('author');
  expect(literals[2].op).toBe(undefined);
  expect(literals[2].values).toHaveLength(1);
  expect(literals[2].values).toStrictEqual(expect.arrayContaining(['joe']));

  expect(literals[3].key).toBe('text');
  expect(literals[3].op).toBe('-');
  expect(literals[3].values).toHaveLength(1);
  expect(literals[3].values).toStrictEqual(expect.arrayContaining(['foo bar']));

  expect(literals[4].key).toBe('text');
  expect(literals[4].op).toBe(undefined);
  expect(literals[4].values).toHaveLength(1);
  expect(literals[4].values).toStrictEqual(expect.arrayContaining(['baz']));
});

test('parse one word', () => {
  const inputText = 'skedaddle';
  const keywords = [];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(1);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining(["skedaddle"]));
});

test('parse one keyword', () => {
  const inputText = 'skedaddle';
  const keywords = ['skedaddle'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(1);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining(["skedaddle"]));
});

test('parse one keyword with separator', () => {
  const inputText = 'skedaddle:';
  const keywords = ['skedaddle'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(2);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining(["skedaddle", ":"]));
});

test('parse query without keywords', () => {
  const inputText = 'Foo bar title:hello author:joe -text:"foo bar" text:baz perex:\'naughty:naughty:monkey\' -trailer';

  const formula = searchbox.parse(inputText);
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(18);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Foo", "bar", "title", ":", "hello", "author", ":", "joe", "-text", ":",
    "foo bar", "text", ":", "baz", "perex", ":", "naughty:naughty:monkey",
    "-trailer"
  ]));
});

test('parse query with keyword-like words', () => {
  const inputText = 'Class:is not class:and not classname nor nameclass';
  const keywords = ['class'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(2);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(8);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Class", ":", "is", "not", "not", "classname", "nor", "nameclass"
  ]));

  expect(literals[1].key).toBe('class');
  expect(literals[1].op).toBe(undefined);
  expect(literals[1].values).toHaveLength(1);
  expect(literals[1].values).toStrictEqual(expect.arrayContaining([
    "and"
  ]));
});

test('parse query with repeated keyword', () => {
  const inputText = 'title:\'Never take\' title:"raisins from rabbits"';
  const keywords = ['title'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('title');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(2);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Never take", "raisins from rabbits"
  ]));
});

test('parse query with explicit fulltext keyword', () => {
  const inputText = 'Never take fulltext:raisins from rabbits';

  const formula = searchbox.parse(inputText);
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(5);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Never", "take", "raisins", "from", "rabbits"
  ]));
});

test('parse query with explicit fulltext keyword and exact match', () => {
  const inputText = 'Never take fulltext:"raisins from rabbits"';

  const formula = searchbox.parse(inputText);
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(3);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Never", "take", "raisins from rabbits"
  ]));
});

test('parse query with exact match', () => {
  const inputText = '\'Never take\' "raisins from rabbits"';

  const formula = searchbox.parse(inputText);
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(1);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(2);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Never take", "raisins from rabbits"
  ]));
});

test('parse empty query', () => {
  const inputText = '';
  const keywords = [];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(0);
});

// Unicode shall be supported since Moo 0.5.1.
test('parse utf8 input', () => {
  const inputText = 'Příliš žluťoučký author:kůň -title:"úpěl ďábelské ódy"';
  const keywords = ['author', 'title'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(3);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(2);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Příliš", "žluťoučký"
  ]));

  expect(literals[1].key).toBe('author');
  expect(literals[1].op).toBe(undefined);
  expect(literals[1].values).toHaveLength(1);
  expect(literals[1].values).toStrictEqual(expect.arrayContaining([
    "kůň"
  ]));

  expect(literals[2].key).toBe('title');
  expect(literals[2].op).toBe('-');
  expect(literals[2].values).toHaveLength(1);
  expect(literals[2].values).toStrictEqual(expect.arrayContaining([
    "úpěl ďábelské ódy"
  ]));
});

// Unicode shall be supported since Moo 0.5.1.
test('parse unicode input', () => {
  const inputText = 'Příliš žluťoučký author:馬 -title:"úpěl ďábelské ódy"';
  const keywords = ['author', 'title'];

  const formula = searchbox.parse(inputText, {keywords});
  const literals = formula.getLiterals();

  expect(literals).toHaveLength(3);

  expect(literals[0].key).toBe('fulltext');
  expect(literals[0].op).toBe(undefined);
  expect(literals[0].values).toHaveLength(2);
  expect(literals[0].values).toStrictEqual(expect.arrayContaining([
    "Příliš", "žluťoučký"
  ]));

  expect(literals[1].key).toBe('author');
  expect(literals[1].op).toBe(undefined);
  expect(literals[1].values).toHaveLength(1);
  expect(literals[1].values).toStrictEqual(expect.arrayContaining([
    "馬"
  ]));

  expect(literals[2].key).toBe('title');
  expect(literals[2].op).toBe('-');
  expect(literals[2].values).toHaveLength(1);
  expect(literals[2].values).toStrictEqual(expect.arrayContaining([
    "úpěl ďábelské ódy"
  ]));
});
