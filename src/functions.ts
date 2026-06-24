import {
	Accumulator,
	AsyncOrIterable,
	Filter,
	KeySelector,
	Map,
	Predicate,
	PromiseOrValue,
} from "./types";
import { AsynkitEmptyError } from "./errors";
import { utilAssertObjectPropertyType } from "./utils";

/**
 * Convert an array into an async iterable
 * @param array
 * @alias asynkitFromIterable
 */
export function asynkitFromArray<TInput>(
	array: ReadonlyArray<TInput>,
): AsyncIterable<TInput> {
	return asynkitFromIterable(array);
}

/**
 * Convert an iterable into an async iterable
 * @param it
 */
export async function* asynkitFromIterable<TInput>(
	it: Iterable<TInput>,
): AsyncIterable<TInput> {
	for (const value of it) {
		yield value;
	}
}

/**
 * Convert the input into a new value
 * @param it
 * @param map
 */
export async function* asynkitMap<TInput, TReturn>(
	it: AsyncOrIterable<TInput>,
	map: Map<TInput, TReturn>,
): AsyncIterable<TReturn> {
	for await (const value of it) {
		yield await map(value);
	}
}

/**
 * Only include values that pass the filter
 * @param it
 * @param filter
 */
export async function* asynkitFilter<TInput, TReturn extends TInput = TInput>(
	it: AsyncOrIterable<TInput>,
	filter: Filter<TInput>,
): AsyncIterable<TReturn> {
	for await (const value of it) {
		if (await filter(value)) {
			// @ts-expect-error It works, so ignore this.
			yield value;
		}
	}
}

/**
 * Convert to an array
 * @param it
 */
export async function asynkitToArray<TInput>(
	it: AsyncOrIterable<TInput>,
): Promise<TInput[]> {
	const array = [];

	for await (const value of it) {
		array.push(value);
	}

	return array;
}

/**
 * Get the first value or return a default value
 * @param it
 * @param def
 */
export async function asynkitFirstOrDefault<TInput>(
	it: AsyncOrIterable<TInput>,
	def?: TInput,
): Promise<TInput | undefined> {
	for await (const value of it) {
		return value;
	}

	return def;
}

/**
 * Get the first value or throw an exception
 * @param it
 * @throws {AsynkitEmptyError}
 */
export async function asynkitFirst<TInput>(
	it: AsyncOrIterable<TInput>,
): Promise<TInput> {
	const first = await asynkitFirstOrDefault(it, undefined);

	if (first) {
		return first;
	}

	throw new AsynkitEmptyError("Async iterable is empty");
}

/**
 * Check if empty or not
 * @param it
 */
export async function asynkitIsEmpty<TInput>(
	it: AsyncOrIterable<TInput>,
): Promise<boolean> {
	return Boolean(await asynkitFirstOrDefault(it, undefined));
}

/**
 * Split the async iterable into arrays with max size of chunkSize
 * @param it
 * @param chunkSize
 */
export async function* asynkitChunk<TInput>(
	it: AsyncOrIterable<TInput>,
	chunkSize: number,
): AsyncIterable<TInput[]> {
	let chunk: TInput[] = [];

	for await (const item of it) {
		chunk.push(item);

		if (chunk.length >= chunkSize) {
			yield chunk;
			chunk = [];
		}
	}

	if (chunk.length > 0) {
		yield chunk;
	}
}

/**
 * Append a value
 * @param it
 * @param values
 */
export async function* asynkitAppend<TInput>(
	it: AsyncOrIterable<TInput>,
	...values: ReadonlyArray<TInput>
): AsyncIterable<TInput> {
	for await (const item of it) {
		yield item;
	}

	for (const value of values) {
		yield value;
	}
}

/**
 * Prepend a value
 * @param it
 * @param values
 */
export async function* asynkitPrepend<TInput>(
	it: AsyncOrIterable<TInput>,
	...values: ReadonlyArray<TInput>
): AsyncIterable<TInput> {
	for (const value of values) {
		yield value;
	}

	for await (const item of it) {
		yield item;
	}
}

/**
 * Check if at least one value fulfills the predicate
 * @param it
 * @param predicate
 */
export async function asynkitSome<TInput>(
	it: AsyncOrIterable<TInput>,
	predicate: Predicate<TInput>,
): Promise<boolean> {
	for await (const item of it) {
		if (await predicate(item)) {
			return true;
		}
	}

	return false;
}

/**
 * Check if all values fulfills the predicate
 * @param it
 * @param predicate
 */
export async function asynkitEvery<TInput>(
	it: AsyncOrIterable<TInput>,
	predicate: Predicate<TInput>,
): Promise<boolean> {
	for await (const item of it) {
		if (!(await predicate(item))) {
			return false;
		}
	}

	return true;
}

/**
 * Reduce an async iterable to one value
 * @param it
 * @param aggregator
 * @param start
 */
export async function asynkitReduce<TInput, TReturn>(
	it: AsyncOrIterable<TInput>,
	aggregator: Accumulator<TInput, TReturn>,
	start: TReturn,
): Promise<TReturn> {
	for await (const item of it) {
		start = await aggregator(start, item);
	}

	return start;
}

/**
 * Convert an async iterable to an object
 * @param it
 * @param keySelector
 */
export function asynkitToObject<TInput, TKey extends keyof TInput>(
	it: AsyncOrIterable<TInput>,
	keySelector: KeySelector<TInput>,
): Promise<Record<TKey, TInput>> {
	return asynkitReduce(
		it,
		(obj, item) => {
			const key = keySelector(item);
			utilAssertObjectPropertyType(key);
			return { ...obj, [key]: item };
		},
		{} as Record<TKey, TInput>,
	);
}

/**
 * Summarize numbers from an async iterable
 * @param it
 */
export function asynkitSum(
	it: AsyncOrIterable<number>,
): Promise<number> {
	return asynkitReduce(it, (sum, num) => sum + num, 0);
}

/**
 * Concatenate multiple async iterables into one
 * @param iterables
 */
export async function* asynkitConcat<TInput>(
	...iterables: ReadonlyArray<AsyncOrIterable<TInput>>
): AsyncIterable<TInput> {
	for (const it of iterables) {
		for await (const item of it) {
			yield item;
		}
	}
}

/**
 * Flatten one level of nested iterables
 * @param it
 */
export async function* asynkitFlatten<TReturn>(
	it:
		| AsyncIterable<AsyncOrIterable<TReturn>>
		| Iterable<AsyncOrIterable<TReturn>>,
): AsyncIterable<TReturn> {
	for await (const inner of it) {
		for await (const item of inner) {
			yield item;
		}
	}
}

/**
 * Yield at most count elements
 * @param it
 * @param count
 */
export async function* asynkitLimit<TInput>(
	it: AsyncOrIterable<TInput>,
	count: number,
): AsyncIterable<TInput> {
	let i = 0;
	for await (const value of it) {
		if (i++ >= count) break;
		yield value;
	}
}

/**
 * Map each element to an iterable and flatten one level
 * @param it
 * @param map
 */
export function asynkitFlatMap<TInput, TReturn>(
	it: AsyncOrIterable<TInput>,
	map: (
		value: TInput,
	) => PromiseOrValue<AsyncOrIterable<TReturn>>,
): AsyncIterable<TReturn> {
	return asynkitFlatten(asynkitMap(it, map));
}

/**
 * Loop through each item
 * @param fn
 */
export async function* asynkitEach<TInput>(
	it: AsyncOrIterable<TInput>,
	fn: (value: TInput) => PromiseOrValue<void>,
): AsyncIterable<TInput> {
	for await (const value of it) {
		await fn(value);
		yield value;
	}
}
