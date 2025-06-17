type PromiseOrValue<T> = Promise<T> | T;
export type Map<TInput, TReturn> = (value: TInput) => PromiseOrValue<TReturn>;
export type Filter<TInput> = (value: TInput) => PromiseOrValue<boolean>;

/**
 * Acts as an async iterable and adds chainable operations
 */
export interface AsyncCollectionInterface<TInput> extends AsyncIterable<TInput> {
    /**
     * Convert the input into a new value
     * @param map
     */
    map<TReturn>(map: Map<TInput, TReturn>): AsyncCollectionInterface<TReturn>;

    /**
     * Only include values that pass the filter
     * @param filter
     */
    filter(filter: Filter<TInput>): AsyncCollectionInterface<TInput>;

    /**
     * Convert to an array
     */
    toArray(): Promise<TInput[]>;

    /**
     * Get the first value or return a default value
     * @param def
     */
    firstOrDefault(def: TInput): Promise<TInput>;

    /**
     * Get the first value or throw an exception
     * @throws {AsyncCollectionEmptyError}
     */
    first(): Promise<TInput>;

    /**
     * Check if empty or not
     */
    isEmpty(): Promise<boolean>;

    /**
     * Split the async iterable into arrays with max size of chunkSize
     * @param chunkSize
     */
    chunk(chunkSize: number): AsyncCollectionInterface<TInput[]>;
}
