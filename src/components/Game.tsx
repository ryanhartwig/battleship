import './Game.css';
import { Button } from 'semantic-ui-react'
import { useCallback, useState } from 'react';
import { Board } from './Board';
import { useAppSelector } from '../app/hooks';
import { selectSettings } from '../store-state/settings/settingsSlice';
import { useDispatch } from 'react-redux';
import { togglePlaceMode } from '../store-state/gameSlice';

export const Main = () => {
  const dispatch = useDispatch();

  const { startPieces } = useAppSelector(selectSettings);
  const [pieces, setPieces] = useState(startPieces);

  const placeMode = useAppSelector((state) => state.game.placeMode)



  const [showCoords, setShowCoords] = useState<boolean>(false);

  const hoverCoords = useCallback(() => {
    setShowCoords((p) => !p);
  }, [])

  const placeSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [])

  return (
    <div>
      
      <Board pieces={pieces} showCoords={showCoords} setPieces={setPieces}/>
      <p>{'' + placeMode}</p>
      <div id='gameinfo'>
        <div id='info-box'>
          <Button color={placeMode ? 'green' : undefined} onClick={placeSegments}>Place Segments</Button>
          <Button onMouseOver={hoverCoords} onMouseOut={hoverCoords}>Show Coords</Button>
        </div>
      </div> 
    </div>
  );
}