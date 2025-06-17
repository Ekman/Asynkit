import type {AsynkitInterface, Filter, Map} from "./interface.js";
import {
	asynkitAppend,
	asynkitChunk,
	asynkitFilter,
	asynkitFirst,
	asynkitFirstOrDefault,
	asynkitFromArray,
	asynkitIsEmpty,
	asynkitMap,
	asynkitPrepend,
	asynkitToArray
} from "./functions.js";

/**
 * Main implementation of an async collection
 */
export class Asynkit<TInput> implements AsynkitInterface<TInput> {
    constructor(private readonly it: AsyncIterable<TInput>) {}

    /**
     * Create a new instance and return an interface
     * @param it
     */
    static create<TInput>(it: AsyncIterable<TInput>): AsynkitInterface<TInput> {
        return new Asynkit<TInput>(it);
    }

    /**
     * Creates a new instance from an array
     * @param array
     */
    static fromArray<TInput>(array: ReadonlyArray<TInput>): Asynkit<TInput> {
        return new Asynkit<TInput>(asynkitFromArray<TInput>(array));
    }

    async *[Symbol.asyncIterator](): AsyncIterator<TInput> {
        for await (const value of this.it) {
            yield value;
        }
    }

    /**
     * @inheritDoc
     */
    map<TReturn>(map: Map<TInput, TReturn>): AsynkitInterface<TReturn> {
        return new Asynkit(asynkitMap(this.it, map));
    }

    /**
     * @inheritDoc
     */
    filter(filter: Filter<TInput>): AsynkitInterface<TInput> {
        return new Asynkit(asynkitFilter(this.it, filter));
    }

    /**
     * @inheritDoc
     */
    toArray(): Promise<TInput[]> {
        return asynkitToArray(this.it);
    }

    /**
     * @inheritDoc
     */
    firstOrDefault(def: TInput): Promise<TInput> {
        return asynkitFirstOrDefault(this.it, def);
    }

    /**
     * @inheritDoc
     */
    first(): Promise<TInput> {
        return asynkitFirst(this.it);
    }

    /**
     * @inheritDoc
     */
    isEmpty(): Promise<boolean> {
        return asynkitIsEmpty(this.it);
    }

    /**
     * @inheritDoc
     */
    chunk(chunkSize: number): AsynkitInterface<TInput[]> {
        return new Asynkit(asynkitChunk(this.it, chunkSize));
    }

	/**
	 * @inheritDoc
	 */
	append(...values: ReadonlyArray<TInput>): AsynkitInterface<TInput> {
		return new Asynkit(asynkitAppend(this.it, ...values));
	}

	/**
	 * @inheritDoc
	 */
	prepend(...values: ReadonlyArray<TInput>): AsynkitInterface<TInput> {
		return new Asynkit(asynkitPrepend(this.it, ...values));
	}
}
