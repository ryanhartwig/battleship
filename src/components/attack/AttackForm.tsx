import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Button, Header, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { characters } from '../../utility/data';
import './AttackForm.css';

import { BoardAction } from '../../types/action';
import { saveAction } from '../../reducers/game/gameSlice';
import { AttackDetails } from './AttackDetails';

interface AttackFormProps {
  coords: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AttackForm = ({ coords, open, setOpen }: AttackFormProps) => {
  const users = useAppSelector((s) => s.game.users);
  const ships = useAppSelector((s) => s.game.ships);
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();
  const shipsSet = useMemo(() => {
    const set = new Set<string>();
    ships.forEach((ship) => {
      ship.segments.forEach((segment) => {
        set.add(`${segment.x}-${segment.y}`);
      });
    });
    return set;
  }, [ships]);

  const actions = useAppSelector((s) => s.game.actions);
  const [x, y] = useMemo(() => coords.split('-').map((n) => Number(n)), [coords]);
  const [action, setAction] = useState<BoardAction>({
    id: Date.now(),
    type: 'attack',
    attacker: -1,
    x,
    y,
    hits: shipsSet.has(coords)
      ? [
          {
            userId: users.self.id,
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
    dispatch(saveAction([action as BoardAction, settings]));
    setOpen(false);
  }, [dispatch, action, settings, setOpen]);
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
      <Modal.Header style={{ color: shipsSet.has(coords) ? 'red' : 'black' }}>
        {`${characters[y]}${x}`}
        {shipsSet.has(coords) ? " - YOU'RE HIT" : ''}
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
                  <Menu.Item onClick={onClearAttacker}>{user?.name}</Menu.Item>
                </Menu>
              );
            })()
          ) : (
            <Menu vertical size="tiny">
              <Menu.Item onClick={() => onSetAttacker(users.self.id)}>{users.self.name}</Menu.Item>
              {users.opponents.map((user) => {
                return (
                  <Menu.Item key={user.id} onClick={() => onSetAttacker(user.id)}>
                    {user.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          )}

          {/* Start of hidden region */}
          {action.attacker > -1 && <AttackDetails action={action} setAction={setAction} />}
          {/* End of hidden region */}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button primary disabled={!actionValid} onClick={onSave}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
