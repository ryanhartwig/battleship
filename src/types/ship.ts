/**
 * Represents a single segment of a ship
 */
export interface ShipSegment {
  x: number
  y: number
  /**
   * Represents the original price that was paid for this segment
   */
  originalCost: number
}

/**
 * Represents a series of segments
 */
export interface Ship {
  id: number
  invalid?: boolean
  segments: ShipSegment[]
}
