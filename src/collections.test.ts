import { Asynkit } from "./collection";
import { utilTestRun } from "./utils-test";
import {
  asynkitFilter,
  asynkitFirst,
  asynkitFirstOrDefault,
  asynkitFromArray,
} from "./functions";
import { AsynkitEmptyError } from "./errors";

describe("collections", () => {
  it("should be able to create from array", async () => {
    const result = await Asynkit.fromArray(["a", "b", "c"])
      .toArray();
    expect(result).toEqual(["a", "b", "c"]);
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

    expect(result).toEqual([100, 1, 2, 3, 4]);
  });

  it("should be able to prepend a value", async () => {
    const result = await Asynkit.fromArray([1, 2, 3, 4])
      .prepend(23)
      .toArray();

    expect(result).toEqual([1, 2, 3, 4, 23]);
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
});
