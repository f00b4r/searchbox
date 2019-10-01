<h1 align=center>Searchbox</h1>

<p align=center>
🌐 <a href="https://stuchl4n3k.net">stuchl4n3k.net</a> | 💻 <a href="https://github.com/stuchl4n3k">stuchl4n3k</a> | 🐦 <a href="https://twitter.com/stuchl4n3k">@stuchl4n3k</a>
</p>

<p align=center>
<a href="https://circleci.com/gh/webkitty/searchbox"><img src="https://img.shields.io/circleci/build/github/webkitty/searchbox?style=flat-square"></a>
<a href="https://codecov.io/gh/webkitty/searchbox"><img src="https://img.shields.io/codecov/c/github/webkitty/searchbox?style=flat-square"></a>
<a href="https://github.com/webkitty/searchbox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/webkitty/searchbox?style=flat-square"></a>
</p>

Text input augmented with Lexer magic✨ to support advanced search features. Searchbox supports multiple user-defined keywords (filters, variables) and also _NOT_ operator.

## Features

- [x] Parses user input string into a structured formula of literals.
- [x] Supports literal negation.
- [x] Supports unicode.
- [ ] Operators are configurable.

## Usage

```typescript
import * as searchbox from '@webkitty/searchbox';

const inputText = 'Never take title:raisins from -author:rabbits';
const keywords = ['title', 'author'];

const formula = searchbox.parse(inputText, {keywords});

// Formula:
//  _: [Never,take,from]	// words not matching any keyword (aka fulltext)
//  title: [raisins]		// "title" keyword match
//  -author: [rabbits]		// "author" keyword match with NOT operator ("-")
```

Please note that only **case-sensitive** keyword matching is supported.

## 📝 License

Copyright © 2019 [stuchl4n3k](https://github.com/stuchl4n3k).
This project is [MIT](LICENSE) licensed.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwebkitty%2Fsearchbox.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwebkitty%2Fsearchbox?ref=badge_large)
