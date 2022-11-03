import './Game.css';
import { Button, Label } from 'semantic-ui-react'
import { useCallback, useState } from 'react';
import { Board } from './Board';
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { togglePlaceMode } from '../store-state/game/gameSlice';
import { Ship } from '../types/ship';
import clsx from 'clsx';

export const Main = () => {
  const dispatch = useDispatch();

  const placeMode = useAppSelector((state) => state.game.placeMode)
  const segments = useAppSelector((state) => state.game.segments)
  const cash = useAppSelector((state) => state.game.cash)

  const [showCoords, setShowCoords] = useState<boolean>(false);
  const [temporaryShip, setTemporaryShip] = useState<Ship | undefined>();

  const hoverCoords = useCallback(() => {
    setShowCoords((p) => !p);
  }, [])

  const placeSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch])

  return (
    <div>
      {/* Header buttons */}
      <div id='gameinfo'>
        <div id='info-box'>
          <Button color={placeMode ? 'green' : undefined} onClick={placeSegments}>Place Segments ({ segments } remaining)</Button>
          <Button onMouseOver={hoverCoords} onMouseOut={hoverCoords}>Show Coords</Button>
          <Label color="green" readOnly>Cash: ${cash.toFixed(2)}</Label>
        </div>
      </div> 

      {/* Game board */}
      <Board showCoords={showCoords} setTemporaryShip={setTemporaryShip} />

      {/* Add ship */}
      <div className={clsx('add', {'add-valid': temporaryShip && !temporaryShip.invalid})}>
        <Button>
          { placeMode && 
            (temporaryShip && !temporaryShip.invalid) ? `Add ship ( - ${temporaryShip?.segments.length} segments )`
            : `invalid`}
        </Button>
      </div>
      
    </div>
  )
}