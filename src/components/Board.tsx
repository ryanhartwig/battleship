import clsx from 'clsx';

import { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { useEditShip } from '../hooks/useEditShip';
import { Field } from './Field';
import { ShipItem, ShipLayer } from './ShipLayer';
import './Board.css';

export const Board = () => {

  const size = useAppSelector(s => s.settings.size + s.settings.upgrades.move.length - 1)
  const fields = useMemo(() => new Array(size*size).fill(''), [size])

  const placeMode = useAppSelector((state) => state.game.placeMode);
  
  const { onMouseDown, onMouseOver, onExit, temporaryShip } = useEditShip();

  return (
    <div 
      id="board" 
      className={clsx({ placing: placeMode })}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      onMouseUp={onExit}
      onMouseLeave={onExit}
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`, 
        gridTemplateRows: `repeat(${size}, 1fr)`,
        overflow: 'visible'
      }}
      
    >
      {fields.map((f, i) => {
        let coords = {x: (i+1) % size || size, y: Math.ceil((i + 1)/size)}
        return <Field key={`${coords.x}-${coords.y}`} coords={coords} />
      })}
      <ShipLayer />
      {temporaryShip && (
        <ShipItem ship={temporaryShip} unselectable creating />
      )}
    </div>
  )
}