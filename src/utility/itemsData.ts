import { Item } from '../types/items'

export const items: Item[] = [{
  type: 'ranged',
  cost: 7,
  distance: 1
}, {
  type: 'longranged',
  cost: 20
}, {
  type: 'bomb',
  cost: 40,
  size: 2
}, {
  type: 'directional',
  cost: 60,
  length: 9
}, {
  type: 'atomic',
  cost: 80,
  size: 3
}]
