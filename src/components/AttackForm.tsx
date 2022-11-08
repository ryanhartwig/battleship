import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, Button, Header, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { characters } from '../utility/data';
import './AttackForm.css';

import { GrAdd } from 'react-icons/gr';

import { itemIcons } from '../utility/storeIcons';
import { BoardAction } from '../types/action';
import { saveAction } from '../reducers/game/gameSlice';
import { RangeModifierType, WeaponType } from '../types/items';
import clsx from 'clsx';

interface AttackFormProps {
  coords: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AttackForm = ({ coords, open, setOpen }: AttackFormProps) => {
  const items = useAppSelector((s) => s.game.store).filter((i) => i.type !== 'segment');
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
  const [typeModalOpen, setTypeModalOpen] = useState<boolean>(false);

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

  let Icon1 = useMemo(() => {
    return itemIcons[action.weapons[0]];
  }, [action.weapons]);
  let Icon2 = useMemo(() => {
    return action.weapons[1] ? itemIcons[action.weapons[1]] : '';
  }, [action.weapons]);

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
  const onToggleHit = useCallback((id: number) => {
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
  }, []);
  const isPlayerHit = useCallback(
    (id: number) => {
      return !!action.hits?.find((h) => h.userId === id);
    },
    [action]
  );
  const onSave = useCallback(() => {
    dispatch(saveAction([action as BoardAction, settings]));
    setOpen(false);
  }, [dispatch, action, settings, setOpen]);
  const actionValid = useMemo(() => {
    return action.attacker > 0;
  }, [action]);

  const setRangeModifier = useCallback((type: RangeModifierType) => {
    setAction((a) => {
      let nextType = a.weapons[1] === type ? undefined : type;
      let weapons = [a.weapons[0], nextType];

      console.log('in setRangeModifier');
      console.log('incoming type: ', type);
      console.log('weapons: ', weapons);
      console.log({ ...a, weapons: [a.weapons[0], nextType] });
      return { ...a, weapons: [a.weapons[0], nextType] };
    });
  }, []);
  const setWeaponType = useCallback((type: WeaponType) => {
    setAction((a) => {
      let weapons = [type, a.weapons[1]];

      console.log('in setWeaponType');
      console.log('incoming type: ', type);
      console.log('weapons: ', weapons);

      console.log({ ...a, weapons: [type, a.weapons[1]] });
      return {
        ...a,
        weapons: [type, a.weapons[1]],
      };
    });
  }, []);

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
        <form
          className="attack-form"
          onSubmit={(e) => {
            e.preventDefault();
            // dispatch
          }}
        >
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

          {/* Attack type */}

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

          <Button
            onClick={(e) => {
              e.preventDefault();
              setTypeModalOpen(true);
            }}
          >
            Edit Attack Type
          </Button>
          <Modal
            onClose={() => {
              setTypeModalOpen(false);
            }}
            open={typeModalOpen}
            style={{ width: '85%' }}
          >
            <Modal.Header style={{ textAlign: 'center' }}>Select Attack Type</Modal.Header>
            <Modal.Content>
              <div className="attack-types">
                {items
                  .filter((item) => item.category === 'weapon')
                  .map((item, index) => {
                    const Icon = itemIcons[item.type];
                    const rotate = item.type === 'directional' ? '270deg' : '';
                    return (
                      <div
                        key={item.type}
                        onClick={() => {
                          setWeaponType(item.type as WeaponType);
                        }}
                        id={item.type}
                        className={clsx('icon-wrapper', { active: action.weapons[0] === item.type })}
                      >
                        <Icon style={{ rotate }} className="item-icon" />
                      </div>
                    );
                  })}
              </div>
              <Header style={{ textAlign: 'center' }}>Range Modifiers</Header>
              <hr />
              <div className="attack-types">
                {items
                  .filter((item) => item.category === 'rangemodifier')
                  .map((item) => {
                    const Icon = itemIcons[item.type];
                    return (
                      <div
                        key={item.type}
                        onClick={() => {
                          setRangeModifier(item.type as RangeModifierType);
                        }}
                        id={item.type}
                        className={clsx('icon-wrapper', { active: action.weapons[1] === item.type })}
                      >
                        <Icon className="item-icon" />
                      </div>
                    );
                  })}
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setTypeModalOpen(false)}>Close</Button>
            </Modal.Actions>
          </Modal>

          {/* Users hit */}
          <Header as="h3" style={{ marginBottom: 0 }}>
            Players Hit
          </Header>
          <Menu vertical color="green">
            <Menu.Item active={isPlayerHit(users.self.id)} onClick={() => {}} color={'green'}>
              {users.self.name}
            </Menu.Item>
            {users.opponents.map((user) => {
              return (
                <Menu.Item active={isPlayerHit(user.id)} color={'green'} key={user.id} onClick={() => onToggleHit(user.id)}>
                  {user.name}
                </Menu.Item>
              );
            })}
          </Menu>
        </form>
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
