import './Game.css';
import { useCallback, useEffect, useState } from 'react';
import { Board } from './Board';
import { useAppSelector } from '../app/hooks';
import { selectSettings } from '../store-state/settings/settingsSlice';

export const Main = () => {

  const { startPieces } = useAppSelector(selectSettings);
  const [pieces, setPieces] = useState(startPieces);

  const [showCoords, setShowCoords] = useState<boolean>(false);

  const hoverCoords = useCallback(() => {
    setShowCoords((p) => !p);
  }, [])

  return (
    <div>
      
      <Board pieces={pieces} showCoords={showCoords} setPieces={setPieces}/>

      <div id='gameinfo'>
        <div id='info-box'>
          <p>Pieces to place: {pieces}</p>
          <button onMouseOver={hoverCoords} onMouseOut={hoverCoords}>Show Coords</button>
        </div>
      </div> 
    </div>
  );
}