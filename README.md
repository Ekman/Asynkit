# Asynkit

[![Build Status](https://circleci.com/gh/Ekman/Asynkit.svg?style=svg)](https://app.circleci.com/pipelines/github/Ekman/Asynkit)

Asynkit extends the capabilities of `AsyncIterable` in JavaScript or TypeScript,
providing utility methods such as map and filter that are natively available for
arrays but not for `AsyncaIterable`. Mastering the usage of `AsyncIterable` (in
any language) is a "shortcut" to reducing your memory footprint in a neat and
tidy way.

## Installation

Install with your favorite package manager:

```bash
npm install --save @nekm/asynkit
```

## Usage

Use it with arrays:

```js
import { Asynkit } from "@nekm/asynkit";

const array = [1, 2, 3, 4, 5];

const result = await Asynkit.fromArray(array)
  .map((x) => x * 2)
  .map((x) => x + 1)
  .filter((x) => x % 2 === 0)
  .toArray();
```

Or let's assume you have a function that fetches a large dataset:

```js
import { Asynkit } from "@nekm/asynkit";

const chunks = Asynkit.create(getLotsAndLotsOfData())
  .filter((item) => item.name === "foo")
  .chunk(10);

for await (const items of chunks) {
  console.log(items); // will output 10 items at a time
}
```

If you do not want to use the class, there are functions as well:

```js
import { asynkitFromArray, asynkitMap, asynkitToArray } from "@nekm/asynkit";

const it = asynkitFromArray([1, 2, 3, 4, 5]);
const mapped = asynkitMap(it, (x) => x * 2);
const array = await asynkitToArray(mapped);
```

## Versioning

This project complies with [Semantic Versioning](https://semver.org/).

## Changelog

For a complete list of changes, and how to migrate between major versions, see
[releases page](https://github.com/Ekman/Asynkit/releases).
