import { useCallback, useMemo } from 'react';
import { Button, Label } from 'semantic-ui-react';
import './ActionBar.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { calculateIncome } from '../utility/calculateIncome';
import { toggleShipVisibility, togglePlaceMode, saveTemporaryShip, takeIncome } from '../reducers/game/gameSlice';

export const ActionBar = () => {
  const dispatch = useAppDispatch();

  const placeMode = useAppSelector((s) => s.game.placeMode);
  const ships = useAppSelector((s) => s.game.ships);
  const temporaryShip = useAppSelector((s) => s.game.temporaryShip);

  const cash = useAppSelector((s) => s.game.cash);

  const income = useMemo(() => {
    return calculateIncome(ships);
  }, [ships]);

  const onToggleVisibility = useCallback(() => {
    dispatch(toggleShipVisibility());
  }, [dispatch]);

  const onTogglePlaceMode = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch]);

  const onSave = useCallback(() => {
    dispatch(saveTemporaryShip());
  }, [dispatch]);

  const onIncome = useCallback(() => {
    dispatch(takeIncome());
  }, [dispatch]);

  return (
    <div className="action-bar">
      <div className="info-box">
        {/* Left */}
        {!placeMode ? (
          <div>
            <Label className="action-label" color="green">
              <p>${cash}</p>
            </Label>
            <Label onClick={onIncome} className="action-label income" color="purple">
              <p>Income: ${income}</p>
            </Label>
          </div>
        ) : (
          <div />
        )}

        {/* Right */}
        <div>
          {placeMode ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {placeMode && temporaryShip?.invalidReason && <p style={{ color: 'rgba(255,0,0,.8)', marginBottom: 0, marginRight: '6px' }}>{temporaryShip.invalidReason}</p>}
              <Button secondary onClick={onTogglePlaceMode}>
                Cancel
              </Button>
              <Button primary disabled={!temporaryShip || temporaryShip.invalid} onClick={onSave}>
                Place
              </Button>
              <Button style={{ marginRight: 0 }} color="green" onClick={onToggleVisibility}>
                Toggle Ships
              </Button>
            </div>
          ) : (
            <Button style={{ marginRight: 0 }} color="green" onClick={onToggleVisibility}>
              Toggle Ships
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
