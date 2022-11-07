import { Ship } from '../types/ship';
import { c } from './c';

const incomeMap: Record<number, number> = {
  3: 3,
  4: 6,
  5: 9,
  6: 12,
  7: 15,
  8: 18,
};

export const calculateIncome = (ships: Ship[]) => {
  let income = 0;
  ships.forEach((ship) => {
    income += incomeMap[ship.segments.length] || 0;
  });
  return c(income);
};
