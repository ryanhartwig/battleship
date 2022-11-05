interface Buyable {
  cost: number;
  name: string;
  description: string;
}

interface Segment extends Buyable {
  type: 'segment';
}

interface RangedMissile extends Buyable {
  type: 'ranged';
  distance: number;
}

interface LongRangedMissile extends Buyable {
  type: 'longranged';
}

interface Bomb extends Buyable {
  type: 'bomb';
  size: number;
}

interface DirectionalBomb extends Buyable {
  type: 'directional';
  length: number;
}

interface AtomicBomb extends Buyable {
  type: 'atomic';
  size: number;
}

export type Item = Segment | RangedMissile | LongRangedMissile | Bomb | DirectionalBomb | AtomicBomb;

export interface Inventory {
  segments: number;
  rangedMissiles: number;
  longRangedMissiles: number;
  bombs: number;
  directionalBombs: number;
  atomicBombs: number;
}
