import {
  utilAssertObjectPropertyType,
  utilIsObjectPropertyType,
} from "./utils";
import { AsynkitBadKeyError } from "./errors";

describe("util", () => {
  it("should be able to detect an object property key type", () => {
    const data = [
      ["foo", true],
      [1, true],
      [{}, false],
    ];

    for (const [input, expected] of data) {
      expect(utilIsObjectPropertyType(input)).toBe(expected);
    }
  });

  it("should be able to assert an object property key type", () => {
    expect(() => utilAssertObjectPropertyType({})).toThrow(AsynkitBadKeyError);
  });
});
