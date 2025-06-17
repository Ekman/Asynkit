import type {AsyncCollectionInterface, Filter, Map} from "./interface.js";
import {
    asyncIterableChunk,
    asyncIterableFilter,
    asyncIterableFirst,
    asyncIterableFirstOrDefault,
    asyncIterableFromArray,
    asyncIterableIsEmpty,
    asyncIterableMap,
    asyncIterableToArray
} from "./functions.js";

/**
 * Main implementation of an async collection
 */
export class AsyncCollection<TInput> implements AsyncCollectionInterface<TInput> {
    constructor(private readonly it: AsyncIterable<TInput>) {}

    /**
     * Create a new instance and return an interface
     * @param it
     */
    static create<TInput>(it: AsyncIterable<TInput>): AsyncCollectionInterface<TInput> {
        return new AsyncCollection<TInput>(it);
    }

    /**
     * Creates a new instance from an array
     * @param array
     */
    static fromArray<TInput>(array: ReadonlyArray<TInput>): AsyncCollection<TInput> {
        return new AsyncCollection<TInput>(asyncIterableFromArray<TInput>(array));
    }

    async *[Symbol.asyncIterator](): AsyncIterator<TInput> {
        for await (const value of this.it) {
            yield value;
        }
    }

    /**
     * @inheritDoc
     */
    map<TReturn>(map: Map<TInput, TReturn>): AsyncCollectionInterface<TReturn> {
        return new AsyncCollection(asyncIterableMap(this.it, map));
    }

    /**
     * @inheritDoc
     */
    filter(filter: Filter<TInput>): AsyncCollectionInterface<TInput> {
        return new AsyncCollection(asyncIterableFilter(this.it, filter));
    }

    /**
     * @inheritDoc
     */
    toArray(): Promise<TInput[]> {
        return asyncIterableToArray(this.it);
    }

    /**
     * @inheritDoc
     */
    firstOrDefault(def: TInput): Promise<TInput> {
        return asyncIterableFirstOrDefault(this.it, def);
    }

    /**
     * @inheritDoc
     */
    first(): Promise<TInput> {
        return asyncIterableFirst(this.it);
    }

    /**
     * @inheritDoc
     */
    isEmpty(): Promise<boolean> {
        return asyncIterableIsEmpty(this.it);
    }

    /**
     * @inheritDoc
     */
    chunk(chunkSize: number): AsyncCollectionInterface<TInput[]> {
        return new AsyncCollection(asyncIterableChunk(this.it, chunkSize));
    }
}
