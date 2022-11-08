import { Item } from '../types/items';

export const items: Item[] = [
  {
    type: 'segment',
    cost: 10,
    name: 'Segment',
    description: 'Can be used to extend an existing ship or create a new one',
    category: 'item',
  },
  {
    type: 'missile',
    cost: 0,
    name: 'Missile',
    description: 'Regular ship attack',
    category: 'weapon',
  },
  {
    type: 'ranged',
    cost: 7,
    distance: 1,
    name: 'Ranged Missile',
    description: 'Allows ship to attack one square further.',
    category: 'rangemodifier',
  },
  {
    type: 'longranged',
    cost: 20,
    name: 'Long-Ranged Missile',
    description: 'Allows ship to attack anywhere.',
    category: 'rangemodifier',
  },
  {
    type: 'bomb',
    cost: 40,
    size: 2,
    name: 'Bomb',
    description: 'Destroys 9 (3x3) squares of ocean.',
    category: 'weapon',
  },
  {
    type: 'directional',
    cost: 60,
    length: 9,
    name: 'Directional Bomb',
    description: 'Destroys 9 (9x1) squares of ocean in a line.',
    category: 'weapon',
  },
  {
    type: 'atomic',
    cost: 80,
    size: 3,
    name: 'Atomic Bomb',
    description: 'Destroys 25 (5x5) squares of ocean.',
    category: 'weapon',
  },
];
