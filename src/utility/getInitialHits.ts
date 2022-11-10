import { Direction } from '../components/attack/AttackDetails';
import { Users } from '../reducers/game/gameSlice';
import { AttackActionHit } from '../types/action';
import { DirectionalBomb, WeaponType } from '../types/items';
import { Ship } from '../types/ship';
import { getRange } from './getRange';

// cX = currentX
// sX = startX
// eX = endX
// x = attacking coord
export const getInitialHits = (coords: string, direction: Direction, bomb: DirectionalBomb, users: Users, weapon: WeaponType, segmentsMap: Map<string, Ship>, _attacksSet: Set<string>): AttackActionHit[] => {
  const [x, y] = coords.split('-').map((n) => Number(n));
  const attacksSet = new Set(_attacksSet);
  if (weapon === 'missile' && segmentsMap.has(coords)) {
    const sunk = segmentsMap.get(coords)?.segments.every((seg) => attacksSet.has(`${seg.x}-${seg.y}`) || (seg.x === x && seg.y === y));

    return [
      {
        userId: users.self.id,
        sunk,
      },
    ];
  } else if (weapon !== 'missile') {
    const range = getRange(coords, weapon, direction, bomb);
    const hits: AttackActionHit[] = [];
    let [{ x: sX, y: sY }, { x: eX, y: eY }] = range;
    for (let cX = sX; cX <= eX; cX++) {
      if (cX < 1) continue;
      for (let cY = sY; cY <= eY; cY++) {
        if (cY < 1) continue;
        if (attacksSet.has(`${cX}-${cY}`)) continue;
        let ship = segmentsMap.get(`${cX}-${cY}`);
        if (!ship) continue;
        attacksSet.add(`${cX}-${cY}`);
        const sunk = segmentsMap.get(coords)?.segments.every((seg) => attacksSet.has(`${seg.x}-${seg.y}`) || (seg.x === cX && seg.y === cY));
        hits.push({
          userId: users.self.id,
          oX: cX - x,
          oY: cY - y,
          sunk,
        });
      }
    }
    return hits;
  }
  return [];
};
