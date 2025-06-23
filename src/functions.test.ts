import {
  asynkitAppend,
  asynkitEvery,
  asynkitFilter,
  asynkitFirst,
  asynkitFirstOrDefault,
  asynkitFromArray,
  asynkitFromIterable,
  asynkitMap,
  asynkitPrepend,
  asynkitSome,
  asynkitToArray,
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

  it("should be able to get the first or default", async () => {
    const result = await asynkitFirstOrDefault(
      asynkitFromArray([2, 4, 5, 6, 8, 9, 10]),
      undefined,
    );
    expect(result).toEqual(2);
  });

  it("should be able to get the first", async () => {
    const result = await asynkitFirst(
      asynkitFromArray([4, 5, 6, 8, 9, 10]),
    );
    expect(result).toEqual(4);
  });

  it("throws if it gets first first in an empty iterable", async () => {
    const result = () => {
      return asynkitFirst(
        asynkitFromArray([]),
      );
    };

    await expect(result).rejects.toThrow(AsynkitEmptyError);
  });

  it("should be able to append a value", async () => {
    const result = await utilTestRun(
      [1, 2, 3, 4],
      (it) => asynkitAppend(it, 100),
    );

    expect(result).toEqual([100, 1, 2, 3, 4]);
  });

  it("should be able to prepend a value", async () => {
    const result = await utilTestRun(
      [1, 2, 3, 4],
      (it) => asynkitPrepend(it, 23),
    );

    expect(result).toEqual([1, 2, 3, 4, 23]);
  });

  it("should be able to test some", async () => {
    const it = asynkitFromArray([1, 2, 3, 4]);

    expect(await asynkitSome(it, (x) => x === 3)).toBeTruthy();
  });

  it("should be able to test every", async () => {
    const it = asynkitFromArray([2, 2, 2, 2]);

    expect(await asynkitEvery(it, (x) => x === 2)).toBeTruthy();
  });
});
