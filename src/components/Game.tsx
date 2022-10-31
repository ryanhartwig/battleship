import './Game.css';
import { useEffect, useState } from 'react';
import { Board } from './Board';

export const Main = () => {

  const [pieces, setPieces] = useState<number>(10);


  useEffect(() => {
  }, [])

  return (
    <div>
      
      <Board pieces={pieces} setPieces={setPieces}/>

      <div id='gameinfo'>
        <div id='info-box'>
          <p>Pieces to place: {pieces}</p>
        </div>
      </div> 
    </div>
  );
}