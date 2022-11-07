import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { togglePlaceMode } from '../reducers/game/gameSlice';
import { Item } from '../types/items';
import { itemIcons } from '../utility/storeIcons';
import './Inventory.css';

export const Inventory = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.game.store);
  const inventory = useAppSelector((state) => state.game.inventory);
  const newSegments = useAppSelector((state) => state.game.temporaryShip?.segments.filter((s) => s.new));

  const handleClick = useCallback(
    (item: Item) => {
      switch (item.type) {
        case 'segment':
          dispatch(togglePlaceMode());
      }
    },
    [dispatch]
  );

  return (
    <div className="inventory-wrapper">
      <div className="items-wrapper">
        {items.map((item) => {
          const Icon = itemIcons[item.type];
          let count = inventory[item.type];
          if (item.type === 'segment' && newSegments) count -= newSegments.length;
          let transform = item.type === 'directional' ? 'rotate(270deg)' : undefined;
          return (
            <div
              key={item.type}
              onClick={() => {
                handleClick(item);
              }}
              className="inventory-item"
            >
              <Icon style={{ fontSize: '30px', border: '1px solid', padding: '2px', borderRadius: '50px', transform }} className="inventory-item-icon" />
              <p>{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
