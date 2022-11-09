import { SetAttackType } from './SetAttackType';
import { GrAdd } from 'react-icons/gr';
import React, { useCallback, useMemo } from 'react';
import './AttackDetails.css';
import { itemIcons } from '../../utility/storeIcons';
import { BoardAction } from '../../types/action';
import { useAppSelector } from '../../app/hooks';
import { Checkbox, Header, Menu } from 'semantic-ui-react';
import { Preview } from './Preview';

interface AttackDetailsProps {
  action: BoardAction;
  setAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  readOnly: boolean;
}

export const AttackDetails = ({ action, setAction, readOnly }: AttackDetailsProps) => {
  const users = useAppSelector((s) => s.game.users);

  let Icon1 = useMemo(() => {
    return itemIcons[action.weapons[0]];
  }, [action.weapons]);
  let Icon2 = useMemo(() => {
    return action.weapons[1] ? itemIcons[action.weapons[1]] : '';
  }, [action.weapons]);

  const isPlayerHit = useCallback(
    (id: number) => {
      return !!action.hits?.find((h) => h.userId === id);
    },
    [action]
  );

  const isPlayerSunk = useCallback(
    (id: number) => {
      return !!action.hits?.find((h) => h.userId === id)?.sunk;
    },
    [action]
  );

  const onToggleHit = useCallback(
    (id: number) => {
      setAction((a) => {
        const next = JSON.parse(JSON.stringify(a)) as BoardAction;
        if (!next.hits) {
          next.hits = [];
        }

        const exists = next.hits?.find((h) => h.userId === id);
        if (exists) {
          next.hits = next.hits.filter((h) => h.userId !== id);
        } else {
          next.hits.push({ userId: id });
        }

        return next;
      });
    },
    [setAction]
  );

  const onToggleSunk = useCallback(
    (e: any, id: number) => {
      e.stopPropagation();
      setAction((a) => {
        const next = JSON.parse(JSON.stringify(a)) as BoardAction;
        if (!next.hits) {
          next.hits = [];
        }

        const hitIndex = next.hits?.findIndex((h) => h.userId === id);
        if (hitIndex > -1) {
          next.hits[hitIndex].sunk = !next.hits[hitIndex].sunk;
        } else {
          next.hits.push({ userId: id, sunk: true });
        }

        return next;
      });
    },
    [setAction]
  );

  return (
    <>
      <div className="attack-types" style={{ justifyContent: 'center' }}>
        <div className="icon-wrapper">
          <Icon1 />
        </div>
        {Icon2 && (
          <>
            <GrAdd />
            <div className="icon-wrapper">
              <Icon2 />
            </div>
          </>
        )}
      </div>

      <br />

      <SetAttackType readOnly={readOnly} action={action} setAction={setAction} />

      {/* Board preview */}
      <Preview action={action} />

      {/* Users hit */}
      <Header as="h3" style={{ marginBottom: 0 }}>
        Players Hit
      </Header>
      <Menu vertical color="green">
        {/* <Menu.Item className="hit-player" disabled={readOnly} active={isPlayerHit(users.self.id)} onClick={() => {}} color={'green'}>
          {users.self.name}
          <Checkbox label="Sunk" checked={isPlayerSunk(users.self.id)} onClick={() => {}} />
        </Menu.Item> */}
        {users.opponents.map((user) => {
          return (
            <Menu.Item className="hit-player" disabled={readOnly} active={isPlayerHit(user.id)} color={'green'} key={user.id} onClick={() => onToggleHit(user.id)}>
              {user.name}
              <Checkbox label="Sunk" checked={isPlayerSunk(user.id)} onClick={(e) => onToggleSunk(e, user.id)} />
            </Menu.Item>
          );
        })}
      </Menu>
    </>
  );
};
