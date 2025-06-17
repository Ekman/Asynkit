import {Filter, Map} from "./interface.js";
import {AsyncCollectionEmptyError} from "./errors.js";

/**
 * Convert an array into an async iterable
 * @param array
 */
export async function* asyncIterableFromArray<TInput>(array: ReadonlyArray<TInput>): AsyncIterable<TInput> {
    for (const value of array) {
        yield value;
    }
}

/**
 * Convert the input into a new value
 * @param it
 * @param map
 */
export async function* asyncIterableMap<TInput, TReturn>(it: AsyncIterable<TInput>, map: Map<TInput, TReturn>): AsyncIterable<TReturn> {
    for await (const value of it) {
        yield await map(value);
    }
}

/**
 * Only include values that pass the filter
 * @param it
 * @param filter
 */
export async function* asyncIterableFilter<TInput>(it: AsyncIterable<TInput>, filter: Filter<TInput>): AsyncIterable<TInput> {
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
export async function asyncIterableToArray<TInput>(it: AsyncIterable<TInput>): Promise<TInput[]> {
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
export async function asyncIterableFirstOrDefault<TInput>(it: AsyncIterable<TInput>, def: TInput): Promise<TInput> {
    for await (const value of it) {
        return value;
    }

    return def;
}

/**
 * Get the first value or throw an exception
 * @param it
 * @throws {AsyncCollectionEmptyError}
 */
export async function asyncIterableFirst<TInput>(it: AsyncIterable<TInput>): Promise<TInput> {
    const first = await asyncIterableFirstOrDefault(it, undefined);

    if (first) {
        return first;
    }

    throw new AsyncCollectionEmptyError("Async iterable is empty");
}

/**
 * Check if empty or not
 * @param it
 */
export async function asyncIterableIsEmpty<TInput>(it: AsyncIterable<TInput>): Promise<boolean> {
    return Boolean(await asyncIterableFirstOrDefault(it, undefined));
}

/**
 * Split the async iterable into arrays with max size of chunkSize
 * @param it
 * @param chunkSize
 */
export async function* asyncIterableChunk<TInput>(it: AsyncIterable<TInput>, chunkSize: number): AsyncIterable<TInput[]> {
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
