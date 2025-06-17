import {asyncIterableFromArray, asyncIterableToArray} from "./functions.js";

export async function utilTestRun<TInput, TReturn = TInput>(array: ReadonlyArray<TInput>, body: (it: AsyncIterable<TInput>) => AsyncIterable<TReturn>): Promise<TReturn[]> {
    const it = asyncIterableFromArray(array);
    const newIt = body(it);
    return asyncIterableToArray(newIt);
}
