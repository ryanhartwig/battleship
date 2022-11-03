import './Game.css';
import { Button, Container, Message } from 'semantic-ui-react';
import { useCallback } from 'react';
import { Board } from './Board';
import { useAppSelector } from '../app/hooks';
import { useDispatch } from 'react-redux';
import { saveTemporaryShip } from '../store-state/game/gameSlice';
import clsx from 'clsx';
import { ActionBar } from './ActionBar';
import { Upgrades } from './Upgrades';

export const Game = () => {
  const dispatch = useDispatch();

  const placeMode = useAppSelector((state) => state.game.placeMode);
  const temporaryShip = useAppSelector((state) => state.game.temporaryShip);

  const onSaveShip = useCallback(() => {
    dispatch(saveTemporaryShip());
  }, [dispatch]);

  return (
    <div className="main">
      <Board />

      <div className="main-content">
        {temporaryShip?.invalidReason && (
          <Container>
            <Message error>{temporaryShip.invalidReason}</Message>
          </Container>
        )}

        {/* Add ship */}
        <div className={clsx('add', { 'add-valid': temporaryShip && !temporaryShip.invalid })}>
          <Button onClick={onSaveShip}>{placeMode && temporaryShip && !temporaryShip.invalid ? `Add ship ( - ${temporaryShip?.segments.length} segments )` : `invalid`}</Button>
        </div>
        <Upgrades />
      </div>

      <ActionBar />
    </div>
  );
};
