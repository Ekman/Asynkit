export type PromiseOrValue<T> = Promise<T> | T;
export type Predicate<TInput> = (value: TInput) => PromiseOrValue<boolean>;
export type Map<TInput, TReturn> = (value: TInput) => PromiseOrValue<TReturn>;
export type Filter<TInput, TReturn extends TInput = TInput> =
  | ((item: TInput) => item is TReturn)
  | Predicate<TInput>;

/**
 * Acts as an async iterable and adds chainable operations
 */
export interface AsynkitInterface<TInput> extends AsyncIterable<TInput> {
  /**
   * Convert the input into a new value
   * @param map
   */
  map<TReturn>(map: Map<TInput, TReturn>): AsynkitInterface<TReturn>;

  /**
   * Only include values that pass the filter
   * @param filter
   */
  filter<TReturn extends TInput = TInput>(
    filter: Filter<TInput, TReturn>,
  ): AsynkitInterface<TReturn>;

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
   * @throws {AsynkitEmptyError}
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
  chunk(chunkSize: number): AsynkitInterface<TInput[]>;

  /**
   * Append a value
   * @param values
   */
  append(...values: ReadonlyArray<TInput>): AsynkitInterface<TInput>;

  /**
   * Prepend a value
   * @param values
   */
  prepend(...values: ReadonlyArray<TInput>): AsynkitInterface<TInput>;

  /**
   * Check if at least one value fulfills the predicate
   * @param predicate
   */
  some(predicate: Predicate<TInput>): Promise<boolean>;

  /**
   * Check if all values fulfills the predicate
   * @param predicate
   */
  every(predicate: Predicate<TInput>): Promise<boolean>;
}
