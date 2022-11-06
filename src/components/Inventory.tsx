import { useAppSelector } from '../app/hooks';
import { itemIcons } from '../utility/storeIcons';
import './Inventory.css';

export const Inventory = () => {
  const items = useAppSelector((state) => state.game.store);
  const inventory = useAppSelector((state) => state.game.inventory);

  return (
    <div className="inventory-wrapper">
      {/* <p>t</p> */}
      <div className="items-wrapper">
        {items.map((item) => {
          const Icon = itemIcons[item.type];
          let count = inventory[item.type];
          let transform = item.type === 'directional' ? 'rotate(270deg)' : undefined;
          return (
            <div>
              <Icon style={{ fontSize: '30px', border: '1px solid', padding: '2px', borderRadius: '50px', transform }} />
              <p>{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
