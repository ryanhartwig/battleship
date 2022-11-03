import './Game.css';
import { Button, Container, Label, Message } from 'semantic-ui-react'
import { useCallback } from 'react';
import { Board } from './Board';
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { saveTemporaryShip, togglePlaceMode } from '../store-state/game/gameSlice';
import clsx from 'clsx';

export const Main = () => {
  const dispatch = useDispatch();

  const placeMode = useAppSelector((state) => state.game.placeMode)
  const segments = useAppSelector((state) => state.game.segments)
  const cash = useAppSelector((state) => state.game.cash)
  const temporaryShip = useAppSelector((state) => state.game.temporaryShip)

  const placeSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch])

  const onSaveShip = useCallback(() => {
    dispatch(saveTemporaryShip());
  }, [dispatch])

  return (
    <div>
      {/* Header buttons */}
      <div id='gameinfo'>
        <div id='info-box'>
          <Button color={placeMode ? 'green' : undefined} onClick={placeSegments}>Place Segments ({ segments - (temporaryShip?.segments.length || 0) } remaining)</Button>
          <Label color="green" readOnly>Cash: ${cash.toFixed(2)}</Label>
        </div>
      </div>

      {/* Game board */}
      <Board />

      {temporaryShip?.invalidReason && (
        <Container>
          <Message error>{temporaryShip.invalidReason}</Message>
        </Container>
      )}

      {/* Add ship */}
      <div className={clsx('add', {'add-valid': temporaryShip && !temporaryShip.invalid})}>
        <Button onClick={onSaveShip}>
          { placeMode && 
            (temporaryShip && !temporaryShip.invalid) ? `Add ship ( - ${temporaryShip?.segments.length} segments )`
            : `invalid`}
        </Button>
      </div>
      
    </div>
  )
}