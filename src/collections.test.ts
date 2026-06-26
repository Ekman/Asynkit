import { describe, expect, it, test } from "vitest";
import { Asynkit } from "./collection";
import { AsynkitEmptyError } from "./errors";

describe("collections", () => {
  it("should be able to create from array", async () => {
    const result = await Asynkit.fromArray(["a", "b", "c"])
      .toArray();
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should be able to create from a sync iterable via create", async () => {
    const result = await Asynkit.create(new Set([1, 2, 3])).toArray();
    expect(result).toEqual([1, 2, 3]);
  });

  it("should be able to create from an iterable", async () => {
    const result = await Asynkit.fromIterable(["a", "b", "c"])
      .toArray();
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should be able to map", async () => {
    const result = await Asynkit.fromArray([1, 2, 3])
      .map((x) => x * 2)
      .toArray();
    expect(result).toEqual([2, 4, 6]);
  });

  it("should be able to filter", async () => {
    const result = await Asynkit.fromArray([2, 4, 5, 6, 8, 9, 10])
      .filter((x) => x % 2 === 0)
      .toArray();
    expect(result).toEqual([2, 4, 6, 8, 10]);
  });

  it("should be able to get the first or default", async () => {
    const result = await Asynkit.fromArray([2, 4, 5, 6, 8, 9, 10])
      .firstOrDefault();
    expect(result).toEqual(2);
  });

  it("should be able to get the first or default, empty", async () => {
    const result = await Asynkit.fromArray([])
      .firstOrDefault();
    expect(result).toBeUndefined();
  });

  it("should be able to get the first", async () => {
    const result = await Asynkit.fromArray([4, 5, 6, 8, 9, 10])
      .first();
    expect(result).toEqual(4);
  });

  it("throws if it gets first first in an empty iterable", () => {
    const result = () => {
      return Asynkit.fromArray([])
        .first();
    };

    return expect(result).rejects.toThrow(AsynkitEmptyError);
  });

  it("should be able to filter undefined", async () => {
    const result = await Asynkit.fromArray([
      2,
      undefined,
      5,
      6,
      undefined,
      9,
      10,
    ])
      .filter((x) => x !== undefined)
      .toArray();
    expect(result).toEqual([2, 5, 6, 9, 10]);
  });

  it("should be able to filter using Promise", async () => {
    const result = await Asynkit.fromArray([
      2,
      undefined,
      5,
      6,
      undefined,
      9,
      10,
    ])
      .filter((x) => Promise.resolve(x === 2))
      .toArray();
    expect(result).toEqual([2]);
  });

  it("should be able to append a value", async () => {
    const result = await Asynkit.fromArray([1, 2, 3, 4])
      .append(100)
      .toArray();

    expect(result).toEqual([1, 2, 3, 4, 100]);
  });

  it("should be able to prepend a value", async () => {
    const result = await Asynkit.fromArray([1, 2, 3, 4])
      .prepend(23)
      .toArray();

    expect(result).toEqual([23, 1, 2, 3, 4]);
  });

  it("should be able to test some", async () => {
    const result = await Asynkit.fromArray([1, 2, 3, 4])
      .some((x) => x === 3);

    expect(result).toBeTruthy();
  });

  it("should be able to test every", async () => {
    const result = await Asynkit.fromArray([2, 2, 2, 2])
      .every((x) => x === 2);

    expect(result).toBeTruthy();
  });

  it("should be able to reduce", async () => {
    const sum = await Asynkit.fromArray([2, 2, 2, 3])
      .reduce((acc, x) => acc + x, 0);

    expect(sum).toEqual(9);
  });

  it("should be able to reduce", async () => {
    const obj = await Asynkit.fromArray([
      {
        foo: "yoo",
        bar: "baz",
      },
      {
        foo: "hello",
        bar: "world",
      },
    ]).toObject((item) => item.bar);

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

  test.each([
    {
      label: "two non-empty iterables",
      first: [1, 2],
      rest: [[3, 4]],
      expected: [1, 2, 3, 4],
    },
    {
      label: "three non-empty iterables",
      first: [1],
      rest: [[2], [3]],
      expected: [1, 2, 3],
    },
    {
      label: "one empty and one non-empty",
      first: [] as number[],
      rest: [[1, 2]],
      expected: [1, 2],
    },
    {
      label: "all empty",
      first: [] as number[],
      rest: [[]],
      expected: [],
    },
    {
      label: "no additional iterables",
      first: [1, 2, 3],
      rest: [],
      expected: [1, 2, 3],
    },
  ])("should concat $label", async ({ first, rest, expected }) => {
    const result = await Asynkit.fromArray(first)
      .concat(...rest.map((r) => Asynkit.fromArray(r)))
      .toArray();
    expect(result).toEqual(expected);
  });

  it("concat accepts sync iterables", async () => {
    const result = await Asynkit.fromArray([1, 2]).concat([3, 4]).toArray();
    expect(result).toEqual([1, 2, 3, 4]);
  });

  test.each([
    { label: "empty outer", inputs: [] as number[][], expected: [] as number[] },
    { label: "single inner", inputs: [[1, 2, 3]], expected: [1, 2, 3] },
    { label: "multiple inner", inputs: [[1, 2], [3, 4], [5]], expected: [1, 2, 3, 4, 5] },
    { label: "some empty inner", inputs: [[], [1, 2], [], [3]], expected: [1, 2, 3] },
  ])("should flatten $label", async ({ inputs, expected }) => {
    const result = await Asynkit.fromArray(inputs)
      .flatten()
      .toArray();
    expect(result).toEqual(expected);
  });

  test.each([
    { label: "empty", input: [] as number[], map: (x: number) => [x], expected: [] as number[] },
    { label: "identity", input: [1, 2, 3], map: (x: number) => [x], expected: [1, 2, 3] },
    { label: "expand each", input: [1, 2], map: (x: number) => [x, x * 10], expected: [1, 10, 2, 20] },
    { label: "filter via empty", input: [1, 2, 3], map: (x: number) => x === 2 ? [] : [x], expected: [1, 3] },
  ])("should flatMap $label", async ({ input, map, expected }) => {
    const result = await Asynkit.fromArray(input)
      .flatMap(map)
      .toArray();
    expect(result).toEqual(expected);
  });

  test.each([
    { label: "empty", input: [] as number[], chunkSize: 2, expected: [] as number[] },
    { label: "chunk smaller than input", input: [1, 2, 3, 4, 5], chunkSize: 2, expected: [2, 4, 6, 8, 10] },
    { label: "chunk equal to input", input: [1, 2, 3], chunkSize: 3, expected: [2, 4, 6] },
    { label: "chunk larger than input", input: [1, 2, 3], chunkSize: 10, expected: [2, 4, 6] },
  ])("should parallelMap preserving order $label", async ({ input, chunkSize, expected }) => {
    const result = await Asynkit.fromArray(input)
      .parallelMap(chunkSize, (x) => x * 2)
      .toArray();
    expect(result).toEqual(expected);
  });
});
