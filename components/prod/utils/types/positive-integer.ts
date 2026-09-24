type PositiveInteger<T extends number> = `${T}` extends
  | "0"
  | `${string}.${string}`
  | `-${string}`
  ? never
  : T;

export { type PositiveInteger };
