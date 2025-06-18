import {Filter, Map, Predicate} from "./interface";
import {AsynkitEmptyError} from "./errors";

/**
 * Convert an array into an async iterable
 * @param array
 */
export async function* asynkitFromArray<TInput>(array: ReadonlyArray<TInput>): AsyncIterable<TInput> {
    for (const value of array) {
        yield value;
    }
}

/**
 * Convert the input into a new value
 * @param it
 * @param map
 */
export async function* asynkitMap<TInput, TReturn>(it: AsyncIterable<TInput>, map: Map<TInput, TReturn>): AsyncIterable<TReturn> {
    for await (const value of it) {
        yield await map(value);
    }
}

/**
 * Only include values that pass the filter
 * @param it
 * @param filter
 */
export async function* asynkitFilter<TInput>(it: AsyncIterable<TInput>, filter: Filter<TInput>): AsyncIterable<TInput> {
    for await (const value of it) {
        if (await filter(value)) {
            yield value;
        }
    }
}

/**
 * Convert to an array
 * @param it
 */
export async function asynkitToArray<TInput>(it: AsyncIterable<TInput>): Promise<TInput[]> {
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
export async function asynkitFirstOrDefault<TInput>(it: AsyncIterable<TInput>, def: TInput): Promise<TInput> {
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
export async function asynkitFirst<TInput>(it: AsyncIterable<TInput>): Promise<TInput> {
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
export async function asynkitIsEmpty<TInput>(it: AsyncIterable<TInput>): Promise<boolean> {
    return Boolean(await asynkitFirstOrDefault(it, undefined));
}

/**
 * Split the async iterable into arrays with max size of chunkSize
 * @param it
 * @param chunkSize
 */
export async function* asynkitChunk<TInput>(it: AsyncIterable<TInput>, chunkSize: number): AsyncIterable<TInput[]> {
    let chunk: TInput[] = []

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
export async function* asynkitAppend<TInput>(it: AsyncIterable<TInput>, ...values: ReadonlyArray<TInput>): AsyncIterable<TInput> {
	for (const value of values) {
		yield value;
	}

	for await (const item of it) {
		yield item;
	}
}

/**
 * Prepend a value
 * @param it
 * @param values
 */
export async function* asynkitPrepend<TInput>(it: AsyncIterable<TInput>, ...values: ReadonlyArray<TInput>): AsyncIterable<TInput> {
	for await (const item of it) {
		yield item;
	}

	for (const value of values) {
		yield value;
	}
}

/**
 * Check if at least one value fulfills the predicate
 * @param it
 * @param predicate
 */
export async function asynkitSome<TInput>(it: AsyncIterable<TInput>, predicate: Predicate<TInput>): Promise<boolean> {
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
export async function asynkitEvery<TInput>(it: AsyncIterable<TInput>, predicate: Predicate<TInput>): Promise<boolean> {
	for await (const item of it) {
		if (!await predicate(item)) {
			return false;
		}
	}

	return true;
}
