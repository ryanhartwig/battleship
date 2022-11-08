import { Coord } from '../components/attack/Preview';
import { WeaponType } from '../types/items';

export const getSize = (attackType: WeaponType) => {
  let size: number = 0;

  switch (attackType) {
    case 'missile':
      size = 1;
      break;
    case 'bomb':
      size = 9;
      break;
    case 'atomic':
      size = 25;
      break;
    case 'directional':
      size = 9;
      break;
  }

  return size;
};

export const fillRange = (range: [Coord, Coord]): Coord[] => {
  const coords: Coord[] = [];
  let [{ x: startX }, { x: endX, y: endY }] = range;
  let { x, y } = { ...range[0] };

  while (y <= endY) {
    while (x <= endX) {
      coords.push({ x, y });
      x++;
    }
    x = startX;
    y++;
  }

  return coords;
};
