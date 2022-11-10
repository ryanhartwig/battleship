import { SetAttackType } from './SetAttackType';
import { GrAdd } from 'react-icons/gr';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AttackDetails.css';
import { itemIcons } from '../../utility/storeIcons';
import { BoardAction } from '../../types/action';
import { useAppSelector } from '../../app/hooks';
import { Checkbox, Header, Menu } from 'semantic-ui-react';
import { Preview } from './Preview';

interface AttackDetailsProps {
  action: BoardAction;
  setAction: React.Dispatch<React.SetStateAction<BoardAction>>;
}

export const AttackDetails = ({ action, setAction }: AttackDetailsProps) => {
  const users = useAppSelector((s) => s.game.users);

  const [selected, setSelected] = useState<string>(`${action.x}-${action.y}`);
  const [currentUser, setCurrentUser] = useState<number>();

  const weapon = action.weapons[0];

  useEffect(() => {
    setSelected(`${action.x}-${action.y}`);
  }, [weapon, action.x, action.y]);

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

  const onSetSunk = useCallback(() => {
    const [x, y] = selected.split('-').map((c) => Number(c));

    const oX = x - action.x || undefined;
    const oY = y - action.y || undefined;

    setAction((a: BoardAction) => {
      let next: BoardAction = JSON.parse(JSON.stringify(a));

      const sunkIndex = next.hits.findIndex((h) => {
        return h.oX === oX && h.oY === oY && currentUser === h.userId;
      });
      console.log(sunkIndex);
      if (sunkIndex === -1 && currentUser) {
        next.hits.push({ userId: currentUser, sunk: true, oX, oY });
      } else {
        next.hits[sunkIndex].sunk = !next.hits[sunkIndex].sunk;
      }

      return next;
    });
  }, [action.x, action.y, currentUser, selected, setAction]);

  const onSetHitUser = useCallback(
    (id: number) => {
      if (currentUser === id) {
        setCurrentUser(undefined);
      } else {
        setCurrentUser(id);
      }
    },
    [currentUser]
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

  const isSunk = useCallback(
    (id: number) => {
      const [x, y] = selected.split('-').map((c) => Number(c));

      return !!action.hits.find((hit) => {
        return (x - action.x || undefined) === hit.oX && (y - action.y || undefined) === hit.oY && hit.userId === id;
      })?.sunk;
    },
    [action.hits, action.x, action.y, selected]
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

      <SetAttackType action={action} setAction={setAction} />

      {/* Board preview */}
      <Preview action={action} setAction={setAction} selected={selected} setSelected={setSelected} hitUser={currentUser} />

      {/* Users hit */}
      <Header as="h3" style={{ marginBottom: 0 }}>
        Players Hit
      </Header>

      {action.weapons[0] === 'missile' ? (
        <Menu vertical color="green">
          {users.opponents.map((user) => {
            return (
              <Menu.Item className="hit-player" active={isPlayerHit(user.id)} color={'green'} key={user.id} onClick={() => onToggleHit(user.id)}>
                {user.name}
                <Checkbox label="Sunk" checked={isPlayerSunk(user.id)} onClick={(e) => onToggleSunk(e, user.id)} />
              </Menu.Item>
            );
          })}
        </Menu>
      ) : (
        <>
          <br></br>
          {currentUser && <Checkbox label="Sunk" checked={currentUser ? isSunk(currentUser) : false} onClick={onSetSunk}></Checkbox>}
          <Menu vertical color="green">
            {users.opponents.map((user) => {
              return (
                <Menu.Item style={{ justifyContent: 'center' }} className="hit-player" active={user.id === currentUser} color={'green'} key={'select' + user.id} onClick={() => onSetHitUser(user.id)}>
                  {user.name}
                </Menu.Item>
              );
            })}
          </Menu>
        </>
      )}
    </>
  );
};
