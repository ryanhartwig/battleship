import { RangeModifierType, WeaponType } from './items';

interface Hit {
  /**
   * In the case of an attack that hits multiple squares,
   * oX and oY will be the offset from the point of attack.
   */
  oX?: number;
  /**
   * In the case of an attack that hits multiple squares,
   * oX and oY will be the offset from the point of attack.
   */
  oY?: number;
  /**
   * The user ID that was hit
   */
  userId: number;
  /**
   * Whether this hit caused this player's ship to sink.
   */
  sunk?: boolean;
}

/**
 * Encapsulates an attack with an item at a square
 */
export interface AttackAction {
  id: number;
  type: 'attack';
  x: number;
  y: number;
  attacker: number;
  /**
   * The pillage level when this hit was incurred.
   * Used for editing / removing actions.
   */
  pillage?: number;
  /**
   * Defaults to Missile
   */
  weapons: [WeaponType, RangeModifierType?];
  hits: Hit[];
}

export type BoardAction = AttackAction;
