import { Direction } from '../components/attack/AttackDetails';
import { RangeModifierType, WeaponType } from './items';

export interface AttackActionHit {
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
  direction: Direction;
  hits: AttackActionHit[];
}

export type BoardAction = AttackAction;
