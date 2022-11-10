import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { useAppSelector } from '../../app/hooks';
import { BoardAction } from '../../types/action';
import { WeaponType, RangeModifierType, DirectionalBomb } from '../../types/items';
import { Ship } from '../../types/ship';
import { getInitialHits } from '../../utility/getInitialHits';
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

  const isSelf = useMemo(() => {
    return action.attacker === self;
  }, [action.attacker, self]);

  const storeItems = useAppSelector((s) => s.game.store);
  const items = useMemo(() => {
    return storeItems.filter((i) => i.type !== 'segment');
  }, [storeItems]);
  const directionalBomb = useMemo(() => storeItems.find((i) => i.type === 'directional') as DirectionalBomb, [storeItems]);

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
        hits: getInitialHits(coords, a.direction, directionalBomb, users, type, segmentsMap, attacksSet),
      }));
    },
    [setAction, attacksSet, coords, directionalBomb, segmentsMap, users]
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
