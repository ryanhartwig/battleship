/**
 * Rounds any arithmetic to 2 digits to avoid floating point arithmetic problems.
 *
 * @param cash The cash / formula
 * @returns The number, rounded to 2 decimal points
 */
export const c = (cash: number) => Number(cash.toFixed(2));
