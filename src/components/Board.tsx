import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { Ship } from '../types/ship';
import './Board.css';
import { Field } from './Field';
import { ShipItem, ShipLayer } from './ShipLayer';

interface BoardProps {
  showCoords: boolean;
}



export const Board = ({ showCoords}: BoardProps) => {

  const size = useAppSelector(s => s.settings.size + s.settings.upgrades.move.length - 1)
  const fields = useMemo(() => new Array(size*size).fill(''), [size])

  const placeMode = useAppSelector((state) => state.game.placeMode)

  const [startCoords, setStartCoords] = useState<number[]>([]);
  const [endCoords, setEndCoords] = useState<number[]>([]);

  const [workingCoords, setWorkingCoords] = useState<[number, number][]>([]);
  // const [validShipCoords, setValidShipCoords] = useState<number[]>([]);
  const [dragging, setDragging] = useState<boolean>(false);

  const onMouseOver = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.target as HTMLDivElement
    if (!field.className.includes('field')) {
      return;
    }
    const [x, y] = field.id.split('-').map((n: any) => Number(n))
    setEndCoords([x, y]);

   if (dragging) {
    let [x1, y1] = startCoords;
    let [x2, y2] = endCoords;

    let xRange = Math.max(x1, x2) - Math.min(x1, x2);
    let yRange = Math.max(y1, y2) - Math.min(y1, y2);

    if (xRange > yRange) { 
      setWorkingCoords([[x1, y1], [x2, y1]]);
    } else {
      setWorkingCoords([[x1, y1], [x1, y2]]);
    }
  }
   
  }, [dragging, endCoords, startCoords, workingCoords]);

  const ship = useMemo((): Ship | undefined => {
    if (!workingCoords.length) return;
    let [[x1, y1], [x2, y2]] = workingCoords;
    return {
      id: Date.now(),
      segments: [{ x: x1, y: y1, originalCost: 10 }, { x: x2, y: y2, originalCost: 10 }] 
    }
  }, [workingCoords])

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const [x, y] = (e.target as HTMLDivElement).id.split('-').map((n: string) => Number(n));
    setStartCoords([x, y]);
    setDragging(true);
  }, []);

  const onExit = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(false);
  }, []);

  


  return (
    <div 
      id="board" 
      className={clsx({ placing: placeMode })}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      // onMouseOut={onExit}
      onMouseUp={onExit}
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`, 
        gridTemplateRows: `repeat(${size}, 1fr)`
      }}
      
    >
      {fields.map((f, i) => {
        let coords = {x: (i+1) % size || size, y: Math.ceil((i + 1)/size)}
        return <Field key={`${coords.x}-${coords.y}`} coords={coords} showCoords={showCoords} />
      })}
      <ShipLayer />
      {ship && (
        <ShipItem ship={ship} unselectable creating />
      )}
    </div>
  )
}