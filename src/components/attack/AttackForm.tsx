import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Button, Header, Menu, Message } from 'semantic-ui-react';
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
  const [edit, setEdit] = useState(false);
  const users = useAppSelector((s) => s.game.users);
  const actions = useAppSelector((s) => s.game.actions);
  const ships = useAppSelector((s) => s.game.ships);
  const levels = useAppSelector((s) => s.game.levels);
  const items = useAppSelector((s) => s.game.store);
  const settings = useAppSelector((s) => s.settings);
  const [override, setOverride] = useState(0);
  const dispatch = useAppDispatch();
  const segmentsMap = useMemo(() => {
    const map = new Map<string, Ship>();
    ships.forEach((ship) => {
      ship.segments.forEach((segment) => {
        map.set(`${segment.x}-${segment.y}`, ship);
      });
    });
    return map;
  }, [ships]);
  const attacksSet = useMemo(() => {
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
  const sunk = segmentsMap.get(coords)?.segments.every((seg) => attacksSet.has(`${seg.x}-${seg.y}`) || (seg.x === x && seg.y === y));
  const [action, setAction] = useState<BoardAction>({
    id: Date.now(),
    type: 'attack',
    attacker: -1,
    x,
    y,
    hits: segmentsMap.has(coords)
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
    setOverride(0);
  }, [action]);

  const range = useMemo(() => {
    const rangedWeapon = items.find((i) => i.type === action.weapons[1]);
    let rangeModifier = settings.upgrades.range[levels.range].attackRange;

    if (!rangedWeapon) {
      return rangeModifier;
    }

    if (rangedWeapon.type === 'ranged') {
      rangeModifier += rangedWeapon.distance;
    }

    return rangeModifier;
  }, [levels, settings, action.weapons, items]);

  const validRangeSet = useMemo(() => {
    const validRange = new Set<string>();
    if (action.weapons[1] === 'longranged') {
      return validRange;
    }
    segmentsMap.forEach((_, coord) => {
      if (attacksSet.has(coord)) {
        return;
      }

      const [x, y] = coord.split('-').map((n) => Number(n));
      const startX = x - range;
      const endX = x + range;
      const startY = y - range;
      const endY = y + range;
      for (let iX = startX; iX <= endX; iX++) {
        if (iX < 1) continue;
        for (let iY = startY; iY <= endY; iY++) {
          if (iY < 1 || validRange.has(`${iX}-${iY}`)) continue;
          validRange.add(`${iX}-${iY}`);
        }
      }
    });

    return validRange;
  }, [segmentsMap, attacksSet, range, action.weapons]);

  useEffect(() => {
    const [x, y] = coords.split('-').map((c) => Number(c));
    const existingAction = actions.find((a) => a.x === x && a.y === y && a.type === 'attack');
    if (existingAction) {
      setAction(existingAction);
      setEdit(true);
    }
  }, [actions, coords]);

  const weapon = action.weapons[0];

  // Reset on change attack
  useEffect(() => {
    setAction((a) => ({
      ...a,
      hits: segmentsMap.has(coords)
        ? [
            {
              userId: users.self.id,
              sunk,
            },
          ]
        : [],
    }));
  }, [weapon, segmentsMap, coords, users.self.id, sunk]);

  const onSetAttacker = useCallback((attacker: number) => {
    setAction((a) => ({ ...a, attacker }));
  }, []);
  const onClearAttacker = useCallback(() => {
    setAction((a) => ({
      ...a,
      attacker: -1,
    }));
  }, []);

  const onOverride = useCallback(() => {
    setOverride((o) => o + 1);
  }, []);
  const onSave = useCallback(() => {
    if (edit) {
      dispatch(removeAction([action.id, settings]));
    }
    dispatch(addAction([action as BoardAction, settings]));
    setOpen(false);
  }, [dispatch, action, settings, setOpen, edit]);
  const onRemove = useCallback(() => {
    dispatch(removeAction([action.id, settings]));
    setOpen(false);
  }, [dispatch, action.id, settings, setOpen]);
  const [valid, reason] = useMemo((): [boolean, string?] => {
    if (action.attacker < 0) {
      return [false, 'You must select an attacker'];
    }

    if (action.attacker !== users.self.id) {
      return [true];
    }

    if (override < 5 && !validRangeSet.has(coords) && action.weapons[1] !== 'longranged') {
      return [false, 'Your ships are out of range.'];
    }

    return [true];
  }, [action, validRangeSet, users, coords, override]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      dimmer="blurring"
      className="cell-modal"
    >
      <Modal.Header style={{ color: segmentsMap.has(coords) ? 'red' : 'black' }}>
        {`${characters[y]}${x}`}
        {segmentsMap.has(coords) ? " - YOU'RE HIT" : ''}
        {sunk ? ' AND SUNK' : ''}
      </Modal.Header>
      <Modal.Content>
        <div className="attack-form">
          {/* Attacker */}
          <Header onClick={onOverride} as="h3" style={{ margin: 0 }}>
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
        {reason && reason !== 'You must select an attacker' && <Message color="red">{reason}</Message>}
        <Button color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        {edit ? (
          <>
            <Button color="red" inverted onClick={onRemove}>
              Delete Action
            </Button>
            <Button primary disabled={!valid} onClick={onSave}>
              Save
            </Button>
          </>
        ) : (
          <Button primary disabled={!valid} onClick={onSave}>
            Save
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};
