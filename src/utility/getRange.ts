import { Direction } from '../components/attack/AttackDetails';
import { Coord } from '../components/attack/Preview';
import { DirectionalBomb, WeaponType } from '../types/items';

export const getRange = (coords: string, weapon: WeaponType, direction: Direction, directional: DirectionalBomb): [Coord, Coord] => {
  const [x, y] = coords.split('-').map((n) => Number(n));
  switch (weapon) {
    case 'missile':
      return [
        { x, y },
        { x, y },
      ];
    case 'bomb':
      return [
        { x: x - 1, y: y - 1 },
        { x: x + 1, y: y + 1 },
      ];
    case 'atomic':
      return [
        { x: x - 2, y: y - 2 },
        { x: x + 2, y: y + 2 },
      ];
    case 'directional':
      const LENGTH = directional.length;
      const LEFT = direction === 'left' ? 0 - LENGTH : 0;
      const RIGHT = direction === 'right' ? LENGTH : 0;
      const UP = direction === 'up' ? 0 - LENGTH : 0;
      const DOWN = direction === 'down' ? LENGTH : 0;
      return [
        {
          x: x + LEFT,
          y: y + UP,
        },
        {
          x: x + RIGHT,
          y: y + DOWN,
        },
      ];
  }
};
