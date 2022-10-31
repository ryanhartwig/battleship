import './Game.css';
import { Button, Label } from 'semantic-ui-react'
import { useCallback, useState } from 'react';
import { Board } from './Board';
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { togglePlaceMode } from '../store-state/game/gameSlice';

export const Main = () => {
  const dispatch = useDispatch();

  const placeMode = useAppSelector((state) => state.game.placeMode)
  const segments = useAppSelector((state) => state.game.segments)
  const cash = useAppSelector((state) => state.game.cash)

  const [showCoords, setShowCoords] = useState<boolean>(false);

  const hoverCoords = useCallback(() => {
    setShowCoords((p) => !p);
  }, [])

  const placeSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch])

  return (
    <div>
      <Board showCoords={showCoords} />
      <p>{'' + placeMode}</p>
      <div id='gameinfo'>
        <div id='info-box'>
          <Button color={placeMode ? 'green' : undefined} onClick={placeSegments}>Place Segments ({ segments } remaining)</Button>
          <Button onMouseOver={hoverCoords} onMouseOut={hoverCoords}>Show Coords</Button>
          <Label color="green" readOnly>Cash: ${cash.toFixed(2)}</Label>
        </div>
      </div> 
    </div>
  );
}