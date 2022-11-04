interface Buyable {
  cost: number;
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

export type Item = RangedMissile | LongRangedMissile | Bomb | DirectionalBomb | AtomicBomb;