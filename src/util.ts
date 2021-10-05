/**
 * Validates that the given object has the specified property.
 */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export function isObject(val: any): val is object {
  return typeof val === 'object';
}
