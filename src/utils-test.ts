import {asynkitFromArray, asynkitToArray} from "./functions";

export async function utilTestRun<TInput, TReturn = TInput>(array: ReadonlyArray<TInput>, body: (it: AsyncIterable<TInput>) => AsyncIterable<TReturn>): Promise<TReturn[]> {
    const it = asynkitFromArray(array);
    const newIt = body(it);
    return asynkitToArray(newIt);
}
