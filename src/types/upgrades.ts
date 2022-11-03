interface Upgrade {
  /**
   * Cost of the upgrade
   */
  cost: number;
}

interface PillageUpgrade extends Upgrade {
  /**
   * Cash gained per segment hit
   */
  earningsPerSegment: number;
  /**
   * Segments gained when sinking an enemy ship
   */
  segmentRewardOnSink: number;
}

interface ShipUpgrade extends Upgrade {
  /**
   * Cost of purchasing new ship segment
   */
  segmentCost: number;
}

interface MoveUpgrade extends Upgrade {}

interface RangeUpgrade extends Upgrade {
  /**
   * Current attack range for each ship
   */
  attackRange: number;
}

export interface Upgrades {
  pillage: PillageUpgrade[];
  ship: ShipUpgrade[];
  move: MoveUpgrade[];
  range: RangeUpgrade[];
}
