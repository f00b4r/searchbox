# Searchbox

> A search box supporting multiple user-defined keywords (filters, variables).

## Features

- [x] Parses user input string into a structured formula of literals.
- [x] Supports literal negation.
- [x] Supports unicode.
- [ ] Case-sensitivity is configurable.
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