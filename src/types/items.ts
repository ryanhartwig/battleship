interface Buyable {
  cost: number;
  name: string;
  description: string;
}

interface Segment extends Buyable {
  type: 'segment';
}

interface Missile extends Buyable {
  type: 'missile';
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

export type Item = Segment | Missile | RangedMissile | LongRangedMissile | Bomb | DirectionalBomb | AtomicBomb;

export interface Inventory {
  segment: number;
  missile: number;
  ranged: number;
  longranged: number;
  bomb: number;
  directional: number;
  atomic: number;
}

export type ItemType = 'segment' | 'missile' | 'ranged' | 'longranged' | 'bomb' | 'directional' | 'atomic';
