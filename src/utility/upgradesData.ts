/* 

interface Upgrade {
  cost: number
}
interface PillageUpgrade extends Upgrade {
  earningsPerSegment: number,
  segmentRewardOnSink: number,
}
interface ShipUpgrade extends Upgrade {
  segmentCost: number,
}
interface MoveUpgrade extends Upgrade {
  extraColumnRow: number,
}
interface RangeUpgrade extends Upgrade {
  attackRange: number,
}
export interface Upgrades {
  pillage: PillageUpgrade[];
  ship: ShipUpgrade[];
  move: MoveUpgrade[];
  range: RangeUpgrade[];
}
*/

import type { Upgrades } from '../types/upgrades';

export const upgradesInitialState: Upgrades = {
  pillage: [
    [0, 2, 1],
    [5, 3, 1],
    [10, 5, 1],
    [15, 7, 1],
    [20, 8, 2],
    [10, 9, 2],
    [15, 9, 3],
    [20, 10, 3],
    [20, 11, 3],
    [30, 12, 3],
    [40, 15, 4],
  ].map(([cost, earningsPerSegment, segmentRewardOnSink]) => ({
    cost,
    earningsPerSegment,
    segmentRewardOnSink,
  })),
  ship: [
    [0, 10],
    [5, 9],
    [7, 8],
    [10, 7],
    [15, 6],
    [20, 5],
    [25, 4],
    [30, 3],
    [40, 2],
    [50, 1],
    [80, 0],
  ].map(([cost, segmentCost]) => ({ cost, segmentCost })),
  move: [0, 20, 30, 40, 50, 60].map((cost) => ({ cost })),
  range: [
    [0, 1],
    [100, 2],
    [100, 3],
    [100, 4],
    [100, Infinity],
  ].map(([cost, attackRange]) => ({ cost, attackRange })),
};
