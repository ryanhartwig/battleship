import { Ship } from '../types/ship';
import './ShipLayer.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { selectShip } from '../store-state/game/gameSlice';

interface ShipItemProps {
  ship: Ship;
  /**
   * Set to true to disable cursor events
   */
  unselectable: boolean;
  creating?: boolean;
}
export const ShipItem: React.FC<ShipItemProps> = ({ ship, unselectable, creating }) => {
  const dispatch = useAppDispatch();
  const onSelectShip = useCallback(() => {
    dispatch(selectShip(ship.id));
  }, [dispatch, ship.id]);
  const editingShip = useAppSelector((s) => s.game.editingShip);
  const maxShipLength = useAppSelector((s) => s.settings.maxShipLength);
  const { startColumn, endColumn, startRow, endRow } = useMemo(() => {
    return {
      startColumn: Math.min(...ship.segments.map((s) => s.x)),
      endColumn: Math.max(...ship.segments.map((s) => s.x)),
      startRow: Math.min(...ship.segments.map((s) => s.y)),
      endRow: Math.max(...ship.segments.map((s) => s.y)),
    };
  }, [ship]);

  return (
    <div
      className={clsx('ship', {
        'ship-unselectable': unselectable || !!editingShip || ship.segments.length >= maxShipLength,
        'ship-selected': editingShip === ship.id,
        'ship-creating': creating,
        'ship-invalid': ship.invalid,
      })}
      onClick={onSelectShip}
      style={{
        gridArea: `${startRow} / ${startColumn} / ${endRow + 1} / ${endColumn + 1}`,
      }}
    ></div>
  );
};

export const ShipLayer = () => {
  const ships = useAppSelector((s) => s.game.ships);
  const placeMode = useAppSelector((s) => s.game.placeMode);
  return (
    <>
      {ships.map((ship) => {
        return <ShipItem ship={ship} unselectable={!placeMode} key={ship.id} />;
      })}
    </>
  );
};
