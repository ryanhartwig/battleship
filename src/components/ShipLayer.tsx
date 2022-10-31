import { Ship } from '../types/ship'
import { useAppSelector } from "../app/hooks";
import { useMemo } from 'react';

interface ShipRenderProps {
  ship: Ship
}
const ShipRender: React.FC<ShipRenderProps> = ({ ship }) => {
  const {
    startColumn,
    endColumn,
    startRow,
    endRow,
  } = useMemo(() => {
    return {
      startColumn: Math.min(...ship.segments.map(s => s.x)),
      endColumn: Math.max(...ship.segments.map(s => s.x)),
      startRow: Math.min(...ship.segments.map(s => s.y)),
      endRow: Math.max(...ship.segments.map(s => s.y))
    }
  }, [ship])
  return (
    <div
      style={{
        gridArea: `${startRow} / ${startColumn} / ${endRow+1} / ${endColumn+1}`,
        backgroundColor: 'red',
        borderRadius: '100px',
        margin: '10px',
        pointerEvents: 'none'
      }}    
    >

    </div>
  )
};

export const ShipLayer = () => {
  const ships = useAppSelector(s => s.game.ships)
  return (
    <>
      {ships.map((ship, i) => {
        return <ShipRender ship={ship} key={i} />
      })}
    </>
  );
};
