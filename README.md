# Asynkit

[![Build Status](https://circleci.com/gh/Ekman/Asynkit.svg?style=svg)](https://app.circleci.com/pipelines/github/Ekman/Asynkit)

Asynkit is an extension to `AsyncIterable`. Arrays have great support in JavaScript. You can do operations such as `map`, `filter` and `includes`. However, `AsyncIterables` have no operations at all and it is up to you to implement them. Enter Asynkit!

Mastering the usage of async iterables (in any language) is a "shortcut" to reducing your memory footprint in a neat and tidy way.

## Installation

Install with your favorite package manager:

```bash
npm install --save asynkit
```

## Usage

Use it with arrays:

```js
import { Asynkit } from "asynkit";

const array = [1, 2, 3, 4, 5];

const result = await Asynkit.fromArray(array)
	.map(x => x * 2)
	.map(x => x + 1)
	.filter(x => x % 2 === 0)
	.toArray();
```

Or lets assume you have a function that fetches a large dataset:

```js
const chunks = Asynkit.create(getLotsAndLotsOfData())
	.filter(item => item.name === "foo")
	.chunk(10);

for await (const items of chunks) {
	console.log(items); // will output 10 items at a time
}
```

## Versioning

This project complies with [Semantic Versioning](https://semver.org/).

## Changelog

For a complete list of changes, and how to migrate between major versions, see [releases page](https://github.com/Ekman/Asynkit/releases).

