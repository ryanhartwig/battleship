/**
 * Represents a single segment of a ship
 */
export interface ShipSegment {
  x: number;
  y: number;
  /**
   * A temporary field to make it easier to figure out
   * if a segment is new or not on a temporary ship.
   */
  new?: boolean;
}

/**
 * Represents a series of segments
 */
export interface Ship {
  id: number;
  invalid?: boolean;
  invalidReason?: string;
  segments: ShipSegment[];
}
