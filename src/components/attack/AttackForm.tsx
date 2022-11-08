import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Button, Header, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { characters } from '../../utility/data';
import './AttackForm.css';

import { BoardAction } from '../../types/action';
import { addAction, removeAction } from '../../reducers/game/gameSlice';
import { AttackDetails } from './AttackDetails';
import { Ship } from '../../types/ship';

interface AttackFormProps {
  coords: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AttackForm = ({ coords, open, setOpen }: AttackFormProps) => {
  const [readOnly, setReadOnly] = useState(false);
  const users = useAppSelector((s) => s.game.users);
  const actions = useAppSelector((s) => s.game.actions);
  const ships = useAppSelector((s) => s.game.ships);
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();
  const shipsMap = useMemo(() => {
    const map = new Map<string, Ship>();
    ships.forEach((ship) => {
      ship.segments.forEach((segment) => {
        map.set(`${segment.x}-${segment.y}`, ship);
      });
    });
    return map;
  }, [ships]);
  const attacksMap = useMemo(() => {
    const attacks = new Set<string>();
    actions
      .filter((a) => a.type === 'attack')
      .forEach(({ x, y, hits }) => {
        attacks.add(`${x}-${y}`);
        hits.forEach(({ oX, oY }) => {
          attacks.add(`${x + (oX ?? 0)}-${y + (oY ?? 0)}`);
        });
      });
    return attacks;
  }, [actions]);

  const [x, y] = useMemo(() => coords.split('-').map((n) => Number(n)), [coords]);
  const sunk = shipsMap.get(coords)?.segments.every((seg) => attacksMap.has(`${seg.x}-${seg.y}`) || (seg.x === x && seg.y === y));
  const [action, setAction] = useState<BoardAction>({
    id: Date.now(),
    type: 'attack',
    attacker: -1,
    x,
    y,
    hits: shipsMap.has(coords)
      ? [
          {
            userId: users.self.id,
            sunk,
          },
        ]
      : [],
    weapons: ['missile'],
  });

  useEffect(() => {
    const [x, y] = coords.split('-').map((c) => Number(c));
    const existingAction = actions.find((a) => a.x === x && a.y === y && a.type === 'attack');
    if (existingAction) {
      setAction(existingAction);
      setReadOnly(true);
    }
  }, [actions, coords]);

  const onSetAttacker = useCallback((attacker: number) => {
    setAction((a) => ({ ...a, attacker }));
  }, []);
  const onClearAttacker = useCallback(() => {
    setAction((a) => ({
      ...a,
      attacker: -1,
    }));
  }, []);

  const onSave = useCallback(() => {
    dispatch(addAction([action as BoardAction, settings]));
    setOpen(false);
  }, [dispatch, action, settings, setOpen]);
  const onRemove = useCallback(() => {
    dispatch(removeAction([action.id, settings]));
    setOpen(false);
  }, [dispatch, action.id, settings, setOpen]);
  const actionValid = useMemo(() => {
    return action.attacker > 0;
  }, [action]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      dimmer="blurring"
      className="cell-modal"
    >
      <Modal.Header style={{ color: shipsMap.has(coords) ? 'red' : 'black' }}>
        {`${characters[y]}${x}`}
        {shipsMap.has(coords) ? " - YOU'RE HIT" : ''}
        {sunk ? ' AND SUNK' : ''}
      </Modal.Header>
      <Modal.Content>
        <div className="attack-form">
          {/* Attacker */}
          <Header as="h3" style={{ margin: 0 }}>
            Attacker
          </Header>
          {action.attacker > -1 ? (
            (() => {
              const user = action.attacker === users.self.id ? users.self : users.opponents.find((u) => u.id === action.attacker);
              return (
                <Menu vertical size="tiny">
                  <Menu.Item disabled={readOnly} onClick={onClearAttacker}>
                    {user?.name}
                  </Menu.Item>
                </Menu>
              );
            })()
          ) : (
            <Menu vertical size="tiny">
              <Menu.Item disabled={readOnly} onClick={() => onSetAttacker(users.self.id)}>
                {users.self.name}
              </Menu.Item>
              {users.opponents.map((user) => {
                return (
                  <Menu.Item disabled={readOnly} key={user.id} onClick={() => onSetAttacker(user.id)}>
                    {user.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          )}

          {/* Start of hidden region */}
          {action.attacker > -1 && <AttackDetails readOnly={readOnly} action={action} setAction={setAction} />}
          {/* End of hidden region */}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        {readOnly ? (
          <Button color="red" inverted onClick={onRemove}>
            Delete Action
          </Button>
        ) : (
          <Button primary disabled={!actionValid} onClick={onSave}>
            Save
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};
