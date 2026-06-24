import { describe, expect, it, test } from "vitest";
import {
  asynkitAppend,
  asynkitConcat,
  asynkitEach,
  asynkitEvery,
  asynkitFilter,
  asynkitFirst,
  asynkitFirstOrDefault,
  asynkitFlatMap,
  asynkitFlatten,
  asynkitFromArray,
  asynkitFromIterable,
  asynkitLimit,
  asynkitMap,
  asynkitPrepend,
  asynkitReduce,
  asynkitSome,
  asynkitSum,
  asynkitToArray,
  asynkitToObject,
} from "./functions";
import { utilTestRun } from "./utils-test";
import { AsynkitEmptyError } from "./errors";

describe("functions", () => {
  it("should be able to create from array", async () => {
    const result = await asynkitToArray(
      asynkitFromArray(["a", "b", "c"]),
    );
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should be able to create from an iterable", async () => {
    const result = await asynkitToArray(
      asynkitFromIterable(["a", "b", "c"]),
    );
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should be able to map", async () => {
    const result = await utilTestRun(
      [1, 2, 3],
      (it) => asynkitMap(it, (x) => x * 2),
    );
    expect(result).toEqual([2, 4, 6]);
  });

  it("should be able to filter", async () => {
    const result = await utilTestRun(
      [2, 4, 5, 6, 8, 9, 10],
      (it) => asynkitFilter(it, (x) => x % 2 === 0),
    );
    expect(result).toEqual([2, 4, 6, 8, 10]);
  });

  it("should be able to filter undefined", async () => {
    const result = await utilTestRun(
      [2, undefined, 5, 6, undefined, 9, 10],
      (it) => asynkitFilter(it, (x) => x !== undefined),
    );
    expect(result).toEqual([2, 5, 6, 9, 10]);
  });

  it("should be able to filter using Promise", async () => {
    const result = await utilTestRun(
      [2, undefined, 5, 6, undefined, 9, 10],
      (it) => asynkitFilter(it, (x) => Promise.resolve(x === 2)),
    );
    expect(result).toEqual([2]);
  });

  it("should be able to get the first or default", async () => {
    const result = await asynkitFirstOrDefault(
      asynkitFromArray([2, 4, 5, 6, 8, 9, 10]),
      undefined,
    );
    expect(result).toEqual(2);
  });

  it("should be able to get the first or default, empty", async () => {
    const result = await asynkitFirstOrDefault(
      asynkitFromArray([]),
      undefined,
    );
    expect(result).toBeUndefined();
  });

  it("should be able to get the first", async () => {
    const result = await asynkitFirst(
      asynkitFromArray([4, 5, 6, 8, 9, 10]),
    );
    expect(result).toEqual(4);
  });

  it("throws if it gets first first in an empty iterable", () => {
    const result = () => {
      return asynkitFirst(
        asynkitFromArray([]),
      );
    };

    return expect(result).rejects.toThrow(AsynkitEmptyError);
  });

  it("should be able to append a value", async () => {
    const result = await utilTestRun(
      [1, 2, 3, 4],
      (it) => asynkitAppend(it, 100),
    );

    expect(result).toEqual([1, 2, 3, 4, 100]);
  });

  it("should be able to prepend a value", async () => {
    const result = await utilTestRun(
      [1, 2, 3, 4],
      (it) => asynkitPrepend(it, 23),
    );

    expect(result).toEqual([23, 1, 2, 3, 4]);
  });

  it("should be able to test some", async () => {
    const it = asynkitFromArray([1, 2, 3, 4]);

    expect(await asynkitSome(it, (x) => x === 3)).toBeTruthy();
  });

  it("should be able to test every", async () => {
    const it = asynkitFromArray([2, 2, 2, 2]);

    expect(await asynkitEvery(it, (x) => x === 2)).toBeTruthy();
  });

  it("should be able to reduce", async () => {
    const it = asynkitFromArray([2, 2, 2, 3]);
    const sum = await asynkitReduce(it, (acc, x) => acc + x, 0);

    expect(sum).toEqual(9);
  });

  it("should be able to reduce", async () => {
    const it = asynkitFromArray([
      {
        foo: "yoo",
        bar: "baz",
      },
      {
        foo: "hello",
        bar: "world",
      },
    ]);

    const obj = await asynkitToObject(it, (item) => item.bar);

    expect(obj).toEqual({
      baz: {
        foo: "yoo",
        bar: "baz",
      },
      world: {
        foo: "hello",
        bar: "world",
      },
    });
  });

  it("should be able to summarize", async () => {
    const it = asynkitFromArray([2, 2, 3, 3]);
    const sum = await asynkitSum(it);

    expect(sum).toEqual(10);
  });

  test.each([
    { label: "more than available", input: [1, 2, 3], count: 10, expected: [1, 2, 3] },
    { label: "exact count", input: [1, 2, 3], count: 3, expected: [1, 2, 3] },
    { label: "fewer than available", input: [1, 2, 3, 4, 5], count: 3, expected: [1, 2, 3] },
    { label: "zero", input: [1, 2, 3], count: 0, expected: [] as number[] },
    { label: "empty input", input: [] as number[], count: 5, expected: [] as number[] },
  ])("should limit $label", async ({ input, count, expected }) => {
    const result = await asynkitToArray(asynkitLimit(asynkitFromArray(input), count));
    expect(result).toEqual(expected);
  });

  test.each([
    { label: "empty outer", inputs: [] as number[][], expected: [] as number[] },
    { label: "single inner", inputs: [[1, 2, 3]], expected: [1, 2, 3] },
    { label: "multiple inner", inputs: [[1, 2], [3, 4], [5]], expected: [1, 2, 3, 4, 5] },
    { label: "some empty inner", inputs: [[], [1, 2], [], [3]], expected: [1, 2, 3] },
  ])("should flatten arrays $label", async ({ inputs, expected }) => {
    const result = await asynkitToArray(
      asynkitFlatten(asynkitFromArray(inputs)),
    );
    expect(result).toEqual(expected);
  });

  test.each([
    { label: "empty outer", inputs: [] as number[][], expected: [] as number[] },
    { label: "single inner", inputs: [[1, 2, 3]], expected: [1, 2, 3] },
    { label: "multiple inner", inputs: [[1, 2], [3, 4], [5]], expected: [1, 2, 3, 4, 5] },
    { label: "some empty inner", inputs: [[], [1, 2], [], [3]], expected: [1, 2, 3] },
  ])("should flatten async iterables $label", async ({ inputs, expected }) => {
    const result = await asynkitToArray(
      asynkitFlatten(asynkitFromArray(inputs.map(asynkitFromArray))),
    );
    expect(result).toEqual(expected);
  });

  test.each([
    { label: "empty", input: [] as number[], map: (x: number) => [x], expected: [] as number[] },
    { label: "identity", input: [1, 2, 3], map: (x: number) => [x], expected: [1, 2, 3] },
    { label: "expand each", input: [1, 2], map: (x: number) => [x, x * 10], expected: [1, 10, 2, 20] },
    { label: "filter via empty", input: [1, 2, 3], map: (x: number) => x === 2 ? [] : [x], expected: [1, 3] },
  ])("should flatMap $label", async ({ input, map, expected }) => {
    const result = await asynkitToArray(
      asynkitFlatMap(asynkitFromArray(input), map),
    );
    expect(result).toEqual(expected);
  });

  test.each([
    { label: "empty", input: [] as number[], expected: [] as number[] },
    { label: "single", input: [1], expected: [1] },
    { label: "multiple", input: [1, 2, 3], expected: [1, 2, 3] },
  ])("should pass values through unchanged on each $label", async ({ input, expected }) => {
    const result = await asynkitToArray(
      asynkitEach(asynkitFromArray(input), () => {}),
    );
    expect(result).toEqual(expected);
  });

  it("should invoke the callback for each value in order", async () => {
    const seen: number[] = [];
    await asynkitToArray(
      asynkitEach(asynkitFromArray([1, 2, 3]), (value) => {
        seen.push(value);
      }),
    );
    expect(seen).toEqual([1, 2, 3]);
  });

  it("should await an async callback before yielding", async () => {
    const seen: number[] = [];
    const result = await asynkitToArray(
      asynkitEach(asynkitFromArray([1, 2, 3]), async (value) => {
        await Promise.resolve();
        seen.push(value);
      }),
    );
    expect(seen).toEqual([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  describe("with sync iterable input", () => {
    test.each([
      { label: "map", fn: (it: Iterable<number>) => asynkitMap(it, (x) => x * 2), input: [1, 2, 3], expected: [2, 4, 6] },
      { label: "filter", fn: (it: Iterable<number>) => asynkitFilter(it, (x) => x % 2 === 0), input: [1, 2, 3, 4], expected: [2, 4] },
      { label: "append", fn: (it: Iterable<number>) => asynkitAppend(it, 99), input: [1, 2], expected: [1, 2, 99] },
      { label: "prepend", fn: (it: Iterable<number>) => asynkitPrepend(it, 0), input: [1, 2], expected: [0, 1, 2] },
      { label: "limit", fn: (it: Iterable<number>) => asynkitLimit(it, 2), input: [1, 2, 3], expected: [1, 2] },
      { label: "each", fn: (it: Iterable<number>) => asynkitEach(it, () => {}), input: [1, 2, 3], expected: [1, 2, 3] },
    ])("$label accepts Iterable", async ({ fn, input, expected }) => {
      expect(await asynkitToArray(fn(input))).toEqual(expected);
    });

    it("toArray accepts Iterable", async () => {
      expect(await asynkitToArray([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("concat accepts Iterables", async () => {
      expect(await asynkitToArray(asynkitConcat([1, 2], [3, 4]))).toEqual([1, 2, 3, 4]);
    });

    it("flatten accepts Iterable outer", async () => {
      expect(await asynkitToArray(asynkitFlatten([[1, 2], [3, 4]]))).toEqual([1, 2, 3, 4]);
    });

    it("flatMap accepts Iterable", async () => {
      expect(await asynkitToArray(asynkitFlatMap([1, 2], (x) => [x, x * 10]))).toEqual([1, 10, 2, 20]);
    });

    it("reduce accepts Iterable", async () => {
      expect(await asynkitReduce([1, 2, 3], (acc, x) => acc + x, 0)).toEqual(6);
    });

    it("some accepts Iterable", async () => {
      expect(await asynkitSome([1, 2, 3], (x) => x === 2)).toBe(true);
    });

    it("every accepts Iterable", async () => {
      expect(await asynkitEvery([2, 2, 2], (x) => x === 2)).toBe(true);
    });
  });

  test.each([
    {
      label: "two non-empty iterables",
      inputs: [[1, 2], [3, 4]],
      expected: [1, 2, 3, 4],
    },
    {
      label: "three non-empty iterables",
      inputs: [[1], [2], [3]],
      expected: [1, 2, 3],
    },
    {
      label: "one empty and one non-empty",
      inputs: [[], [1, 2]],
      expected: [1, 2],
    },
    {
      label: "all empty",
      inputs: [[], []],
      expected: [],
    },
    {
      label: "single iterable",
      inputs: [[1, 2, 3]],
      expected: [1, 2, 3],
    },
    {
      label: "no iterables",
      inputs: [],
      expected: [],
    },
  ])("should concat $label", async ({ inputs, expected }) => {
    const result = await asynkitToArray(
      asynkitConcat(...inputs.map(asynkitFromArray)),
    );
    expect(result).toEqual(expected);
  });
});
