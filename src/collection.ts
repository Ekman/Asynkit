import type {
  Accumulator,
  AsynkitInterface,
  Filter,
  KeySelector,
  Map,
  Predicate,
} from "./interface";
import {
  asynkitAppend,
  asynkitChunk,
  asynkitEvery,
  asynkitFilter,
  asynkitFirst,
  asynkitFirstOrDefault,
  asynkitFromArray,
  asynkitFromIterable,
  asynkitIsEmpty,
  asynkitMap,
  asynkitPrepend,
  asynkitReduce,
  asynkitSome,
  asynkitToArray,
  asynkitToObject,
} from "./functions";

/**
 * Main implementation of an async collection
 */
export class Asynkit<TInput> implements AsynkitInterface<TInput> {
  constructor(private readonly it: AsyncIterable<TInput>) {
  }

  /**
   * Create a new instance and return an interface
   * @param it
   */
  static create<TInput>(it: AsyncIterable<TInput>): AsynkitInterface<TInput> {
    if (it instanceof Asynkit) {
      return it;
    }

    return new Asynkit<TInput>(it);
  }

  /**
   * Creates a new instance from an array
   * @param array
   * @alias fromIterable
   */
  static fromArray<TInput>(
    array: ReadonlyArray<TInput>,
  ): AsynkitInterface<TInput> {
    return new Asynkit<TInput>(asynkitFromArray<TInput>(array));
  }

  /**
   * Creates a new instance from an iterable
   * @param it
   */
  static fromIterable<TInput>(it: Iterable<TInput>): AsynkitInterface<TInput> {
    return new Asynkit<TInput>(asynkitFromIterable(it));
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
  filter<TReturn extends TInput = TInput>(
    filter: Filter<TInput, TReturn>,
  ): AsynkitInterface<TReturn> {
    return new Asynkit(asynkitFilter<TInput, TReturn>(this.it, filter));
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
  firstOrDefault(def?: TInput): Promise<TInput | undefined> {
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

  /**
   * @inheritDoc
   */
  some(predicate: Predicate<TInput>): Promise<boolean> {
    return asynkitSome(this.it, predicate);
  }

  /**
   * @inheritDoc
   */
  every(predicate: Predicate<TInput>): Promise<boolean> {
    return asynkitEvery(this.it, predicate);
  }

  /**
   * @inheritDoc
   */
  reduce<TReturn>(
    acc: Accumulator<TInput, TReturn>,
    start: TReturn,
  ): Promise<TReturn> {
    return asynkitReduce(this.it, acc, start);
  }

  /**
   * @inheritDoc
   */
  toObject<TKey extends keyof TInput>(
    keySelector: KeySelector<TInput>,
  ): Promise<Record<TKey, TInput>> {
    return asynkitToObject(this.it, keySelector);
  }
}
