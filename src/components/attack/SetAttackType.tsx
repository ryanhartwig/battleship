import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { useAppSelector } from '../../app/hooks';
import { BoardAction } from '../../types/action';
import { WeaponType, RangeModifierType } from '../../types/items';
import { itemIcons } from '../../utility/storeIcons';

interface SetAttackTypeProps {
  action: BoardAction;
  setAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  readOnly: boolean;
}

export const SetAttackType = ({ action, setAction, readOnly }: SetAttackTypeProps) => {
  const [typeModalOpen, setTypeModalOpen] = useState<boolean>(false);
  const self = useAppSelector((s) => s.game.users.self.id);

  const inventory = useAppSelector((s) => s.game.inventory);

  const isSelf = useMemo(() => {
    return action.attacker === self;
  }, [action.attacker, self]);

  const storeItems = useAppSelector((s) => s.game.store);
  const items = useMemo(() => {
    return storeItems.filter((i) => i.type !== 'segment');
  }, [storeItems]);

  useEffect(() => {
    setAction((a) => ({ ...a, weapons: ['missile'] }));
  }, [action.attacker, setAction]);

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
        disabled={readOnly}
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
