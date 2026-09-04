// Money is stored as non-negative integer cents. This module is the only place
// that converts between cents and reais, so no `/100` is scattered around.

const PRECISION = 12;

// `value * 100` carries float noise: 12.345 * 100 === 1234.4999999999998, which
// Math.round would turn into 1234. toPrecision trims that noise first.
export function toCents(value) {
  const number = typeof value === 'string' ? Number(value) : value;
  if (number === null || number === undefined || !Number.isFinite(number)) return 0;

  return Math.round(Number((number * 100).toPrecision(PRECISION)));
}

// Rounding policy for derived money: half up, after trimming float noise.
export function roundCents(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Number(value.toPrecision(PRECISION)));
}

export function fromCents(cents) {
  if (!Number.isFinite(cents)) return 0;
  return cents / 100;
}

export function isCents(value) {
  return Number.isInteger(value) && value >= 0;
}

// Mongoose field definition for a money column. Kept here so the validator and
// its message live next to the conversion rules.
export const centsField = (extra = {}) => ({
  type: Number,
  min: 0,
  validate: { validator: isCents, message: '{PATH} must be an integer amount in cents' },
  ...extra,
});
