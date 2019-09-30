<h1 align=center>Searchbox</h1>

<p align=center>
🕹 <a href="https://stuchl4n3k.net">stuchl4n3k.net</a> | 💻 <a href="https://github.com/stuchl4n3k">stuchl4n3k</a> | 🐦 <a href="https://twitter.com/stuchl4n3k">@stuchl4n3k</a>
</p>

<p align=center>
<a href="https://circleci.com/gh/webkitty/searchbox"><img src="https://img.shields.io/circleci/build/github/webkitty/searchbox?style=flat-square"></a>
<a href="https://github.com/webkitty/searchbox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/webkitty/searchbox?style=flat-square"></a>
</p>

A search box supporting multiple user-defined keywords (filters, variables).

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
//  fulltext: [Never,take,from]
//  title: [raisins]
//  -author: [rabbits]
```

Please note that only **case-sensitive** keyword matching is currently supported.

## 📝 License

Copyright © 2019 [stuchl4n3k](https://github.com/stuchl4n3k).
This project is [MIT](LICENSE) licensed.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwebkitty%2Fsearchbox.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwebkitty%2Fsearchbox?ref=badge_large)
