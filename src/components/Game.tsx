import './Game.css';
import { useCallback, useEffect, useState } from 'react';
import { Board } from './Board';

export const Main = () => {

  const [pieces, setPieces] = useState<number>(10);
  const [showCoords, setShowCoords] = useState<boolean>(false);

  const hoverCoords = useCallback(() => {
    setShowCoords((p) => !p);
  }, [])

  return (
    <div>
      
      <Board pieces={pieces} setPieces={setPieces} showCoords={showCoords}/>

      <div id='gameinfo'>
        <div id='info-box'>
          <p>Pieces to place: {pieces}</p>
          <button onMouseOver={hoverCoords} onMouseOut={hoverCoords}>Show Coords</button>
        </div>
      </div> 
    </div>
  );
}