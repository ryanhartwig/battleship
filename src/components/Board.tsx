import { Dispatch, SetStateAction, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectSettings } from '../store-state/settings/settingsSlice';
import './Board.css';
import { Field } from './Field';

interface BoardProps {
  pieces: number;
  showCoords: boolean;
  setPieces: React.Dispatch<React.SetStateAction<number>>;
}

export const Board = ({ pieces, setPieces, showCoords}: BoardProps) => {

  const { size } = useAppSelector(selectSettings);
  const [fields] = useState<null[]>(new Array(size*size).fill(''));

  return (
    <div 
      id="board" 
      style={{gridTemplateColumns: `repeat(${size}, 1fr)`, 
              gridTemplateRows: `repeat(${size}, 1fr)`}}>
      {fields.map((f, i) => {
        let coords = {x: (i+1) % size || size, y: Math.ceil((i + 1)/size)}
        return <Field key={`${coords.x}-${coords.y}`} coords={coords} showCoords={showCoords} pieces={pieces} setPieces={setPieces} />
      })}
    </div>
  )
}