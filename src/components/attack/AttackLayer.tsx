import clsx from 'clsx';
import './AttackLayer.css';
import { useAppSelector } from '../../app/hooks';
import { BoardAction } from '../../types/action';
import { User } from '../../types/user';
import { useMemo } from 'react';
import { getUser } from '../../utility/getUser';
import { getRange } from '../../utility/getRange';
import { DirectionalBomb } from '../../types/items';

interface AttackProps {
  action: BoardAction;
  self: User;
  opponents: User[];
  coords?: string;
}
const Attack: React.FC<AttackProps> = ({ action, self, opponents, coords }) => {
  let x = action.x;
  let y = action.y;
  if (coords) {
    [x, y] = coords.split('-').map((n) => Number(n));
  }
  const { attacker, hits } = useMemo(() => {
    const attacker = getUser(action.attacker, self, opponents).initial;
    let hits: string = '';
    if (action.weapons[0] === 'missile') {
      hits = action.hits
        .filter((h) => h.userId !== self.id)
        .slice(0, 2)
        .map((h) => getUser(h.userId, self, opponents).initial)
        .join(',');
      if (action.hits.filter((h) => h.userId !== self.id).length > 2) {
        hits += '-';
      }
    } else {
      const initials = action.hits.filter((h) => h.userId !== self.id && (h.oX || 0) === x - action.x && (h.oY || 0) === y - action.y).map((h) => getUser(h.userId, self, opponents).initial);
      hits = initials.slice(0, 2).join(',');
      if (initials.length > 2) {
        hits += '-';
      }
    }

    return {
      attacker,
      hits,
    };
  }, [action, self, opponents, x, y]);
  return (
    <div
      className={clsx('attack-cell', { miss: action.hits.length === 0 })}
      style={{
        gridArea: `${y} / ${x} / ${y} / ${x}`,
      }}
    >
      <div className="attacker">{attacker}</div>
      <div className="hits">{hits}</div>
    </div>
  );
};

export const AttackLayer = () => {
  const actions = useAppSelector((s) => s.game.actions);
  const users = useAppSelector((s) => s.game.users);
  const bomb = useAppSelector((s) => s.game.store.find((s) => s.type === 'directional') as DirectionalBomb);

  const display = useMemo(() => {
    const attacks: React.ReactNode[] = [];
    actions
      .filter((a) => a.type === 'attack')
      .forEach((attack) => {
        attacks.push(<Attack key={attack.id} action={attack} self={users.self} opponents={users.opponents} />);
        const range = getRange(`${attack.x}-${attack.y}`, attack.weapons[0], attack.direction, bomb);

        for (let cX = range[0].x; cX <= range[1].x; cX++) {
          if (cX < 1) continue;
          for (let cY = range[0].y; cY <= range[1].y; cY++) {
            if (cY < 1) continue;
            attacks.push(<Attack key={`${attack.id}-${cX}-${cY}`} action={attack} self={users.self} opponents={users.opponents} coords={`${cX}-${cY}`} />);
          }
        }
      });
    return attacks;
  }, [actions, users, bomb]);

  return <>{display}</>;
};
