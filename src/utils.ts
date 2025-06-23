import { AsynkitBadKeyError } from "./errors";

type ObjectPropertyType = string | number | symbol;

/**
 * Check if a value can be used as an object property key.
 * @param value
 */
export function utilIsObjectPropertyType(
  value: unknown,
): value is ObjectPropertyType {
  return typeof value === "string" || typeof value === "number" ||
    typeof value === "symbol";
}

/**
 * Assert that a value can be used as an object property key.
 * @param value
 */
export function utilAssertObjectPropertyType(
  value: unknown,
): asserts value is ObjectPropertyType {
  if (!utilIsObjectPropertyType(value)) {
    throw new AsynkitBadKeyError(
      "A key of an object must be a string, number or symbol.",
    );
  }
}
