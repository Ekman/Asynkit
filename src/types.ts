export type PromiseOrValue<T> = Promise<T> | T;
export type AsyncOrIterable<TInput> = AsyncIterable<TInput> | Iterable<TInput>;
export type Predicate<TInput> = (value: TInput) => PromiseOrValue<boolean>;
export type Map<TInput, TReturn> = (value: TInput) => PromiseOrValue<TReturn>;
export type Filter<TInput, TReturn extends TInput = TInput> =
	| ((item: TInput) => item is TReturn)
	| Predicate<TInput>;
export type Accumulator<TInput, TReturn> = (
	acc: TReturn,
	item: TInput,
) => PromiseOrValue<TReturn>;
export type KeySelector<TInput> = (item: TInput) => TInput[keyof TInput];
