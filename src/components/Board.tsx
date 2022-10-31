import { useState } from 'react';
import './Board.css';
import { Field } from './Field';

interface BoardProps {
  pieces: number;
  setPieces: React.Dispatch<React.SetStateAction<number>>;
}

export const Board = ({ pieces, setPieces}: BoardProps) => {

  const [size] = useState<number>(10);
  const [fields] = useState<undefined[]>(new Array(size*size).fill(''));

  return (
    <div 
      id="board" 
      style={{gridTemplateColumns: `repeat(${size}, 1fr)`, 
              gridTemplateRows: `repeat(${size}, 1fr)`}}>
      {fields.map((f, i) => {
        let coords = {x: (i+1) % size || size, y: Math.ceil((i + 1)/size)}
        return <Field pieces={pieces} setPieces={setPieces} coords={coords}/>
      })}
    </div>
  )
}