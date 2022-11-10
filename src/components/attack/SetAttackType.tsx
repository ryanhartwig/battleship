import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { useAppSelector } from '../../app/hooks';
import { BoardAction } from '../../types/action';
import { WeaponType, RangeModifierType } from '../../types/items';
import { Ship } from '../../types/ship';
import { itemIcons } from '../../utility/storeIcons';

interface SetAttackTypeProps {
  action: BoardAction;
  setAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  coords: string;
  segmentsMap: Map<string, Ship>;
  attacksSet: Set<string>;
}

export const SetAttackType = ({ action, setAction, coords, segmentsMap, attacksSet }: SetAttackTypeProps) => {
  const [typeModalOpen, setTypeModalOpen] = useState<boolean>(false);
  const self = useAppSelector((s) => s.game.users.self.id);

  const inventory = useAppSelector((s) => s.game.inventory);
  const users = useAppSelector((s) => s.game.users);
  const sunk = segmentsMap.get(coords)?.segments.every((seg) => attacksSet.has(`${seg.x}-${seg.y}`) || (seg.x === x && seg.y === y));
  const [x, y] = useMemo(() => coords.split('-').map((n) => Number(n)), [coords]);

  const isSelf = useMemo(() => {
    return action.attacker === self;
  }, [action.attacker, self]);

  const storeItems = useAppSelector((s) => s.game.store);
  const items = useMemo(() => {
    return storeItems.filter((i) => i.type !== 'segment');
  }, [storeItems]);

  const attackerRef = useRef(action.attacker);
  useEffect(() => {
    if (attackerRef.current === action.attacker) return;
    attackerRef.current = action.attacker;
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
      weapons: ['missile'],
    }));
  }, [action.attacker, coords, segmentsMap, setAction, sunk, users.self.id]);

  const setRangeModifier = useCallback(
    (type: RangeModifierType) => {
      setAction((a) => {
        let nextType = a.weapons[1] === type ? undefined : type;
        return {
          ...a,
          weapons: [a.weapons[0], nextType],
        };
      });
    },
    [setAction]
  );
  const setWeaponType = useCallback(
    (type: WeaponType) => {
      setAction((a) => ({
        ...a,
        weapons: [type, a.weapons[1]],
      }));
    },
    [setAction]
  );

  return (
    <>
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
              .map((item) => {
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
                    style={item.type !== 'missile' && isSelf && !inventory[item.type] ? { opacity: '0.5', pointerEvents: 'none' } : {}}
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
                    style={item.type !== 'missile' && isSelf && !inventory[item.type] ? { opacity: '0.5', pointerEvents: 'none' } : {}}
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
    </>
  );
};
