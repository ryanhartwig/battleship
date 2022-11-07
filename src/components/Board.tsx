import clsx from 'clsx';

import { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import { useEditShip } from '../hooks/useEditShip';
import { Field } from './Field';
import { ShipItem, ShipLayer } from './ShipLayer';
import './Board.css';
import { useBoardSize } from '../hooks/useBoardSize';
import { Inventory } from './Inventory';

export const Board = () => {
  const sizePx = useBoardSize();

  const size = useAppSelector((s) => s.settings.size + s.settings.upgrades.move.length - 1);
  const fields = useMemo(() => new Array(size * size).fill(''), [size]);

  const placeMode = useAppSelector((state) => state.game.placeMode);

  const { onMouseDown, onMouseMove, onMouseUp, onTouchMove, onTouchStart, temporaryShip } = useEditShip();

  return (
    <div style={{ maxWidth: '100vw', position: 'relative' }}>
      {/* <Inventory /> */}
      <div
        id="board"
        className={clsx({ placing: placeMode })}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onClick={onClick}
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
          overflow: 'visible',
          width: `${sizePx}px`,
          height: `${sizePx}px`,
          flexBasis: `${sizePx}px`,
        }}
      >
        {fields.map((f, i) => {
          let coords = { x: (i + 1) % size || size, y: Math.ceil((i + 1) / size) };
          return <Field key={`${coords.x}-${coords.y}`} coords={coords} />;
        })}
        <ShipLayer />
        {temporaryShip && <ShipItem ship={temporaryShip} unselectable creating />}
      </div>
      <div className="resources">
        <Inventory />
      </div>
    </div>
  );
};
