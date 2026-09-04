// The canonical implementation lives with the API so both sides share one set of
// conversion rules. This module only re-exports it for the `@/lib` import path.
export { fromCents, isCents, roundCents, toCents } from '../../api/lib/money.js';
