import { useState } from 'react';
import { fields } from '../utility/data';
import './Board.css';
import { Field } from './Field';

interface BoardProps {
  pieces: number;
  setPieces: React.Dispatch<React.SetStateAction<number>>;
}

export const Board = ({ pieces, setPieces}: BoardProps) => {
  



  return (
    <div id="board">
      {fields.map((f, i) => {
        let coords = {x: (i+1) % 10 || 10, y: Math.ceil((i + 1)/10)}
        return <Field pieces={pieces} setPieces={setPieces} coords={coords}/>
      }
        
      )}
    </div>
  )
}