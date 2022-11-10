import clsx from 'clsx';
import './AttackLayer.css';
import { useAppSelector } from '../../app/hooks';
import { BoardAction } from '../../types/action';
import { User } from '../../types/user';
import { useMemo } from 'react';
import { getUser } from '../../utility/getUser';

interface AttackProps {
  action: BoardAction;
  self: User;
  opponents: User[];
}
const Attack: React.FC<AttackProps> = ({ action, self, opponents }) => {
  const { attacker, hits } = useMemo(() => {
    const attacker = getUser(action.attacker, self, opponents).initial;
    let hits = action.hits
      .filter((h) => h.userId !== self.id)
      .slice(0, 2)
      .map((h) => getUser(h.userId, self, opponents).initial)
      .join(',');
    if (action.hits.filter((h) => h.userId !== self.id).length > 2) {
      hits += '-';
    }

    return {
      attacker,
      hits,
    };
  }, [action, self, opponents]);
  return (
    <div
      className={clsx('attack-cell', { miss: action.hits.length === 0 })}
      style={{
        gridArea: `${action.y} / ${action.x} / ${action.y} / ${action.x}`,
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

  return (
    <>
      {actions
        .filter((a) => a.type === 'attack')
        .map((action) => {
          return <Attack key={action.id} action={action} self={users.self} opponents={users.opponents} />;
        })}
    </>
  );
};
