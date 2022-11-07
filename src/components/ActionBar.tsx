import { useCallback, useMemo } from 'react';
import { Button, Label } from 'semantic-ui-react';
import './ActionBar.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { saveTemporaryShip, takeIncome, togglePlaceMode } from '../reducers/game/gameSlice';
import { calculateIncome } from '../utility/calculateIncome';

export const ActionBar = () => {
  const dispatch = useAppDispatch();

  const placeMode = useAppSelector((s) => s.game.placeMode);
  const ships = useAppSelector((s) => s.game.ships);
  const temporaryShip = useAppSelector((s) => s.game.temporaryShip);

  const cash = useAppSelector((s) => s.game.cash);

  const income = useMemo(() => {
    return calculateIncome(ships);
  }, [ships]);

  const onPlaceSegments = useCallback(() => {
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
        {!placeMode && (
          <div>
            <Label className="action-label" color="green">
              <p>${cash}</p>
            </Label>
            <Label onClick={onIncome} className="action-label income" color="purple">
              <p>Income: ${income}</p>
            </Label>
          </div>
        )}

        {/* Right */}
        <div>
          {placeMode ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button secondary onClick={onPlaceSegments}>
                Cancel
              </Button>
              <Button primary disabled={!temporaryShip || temporaryShip.invalid} onClick={onSave}>
                Place
              </Button>
              {placeMode && temporaryShip?.invalidReason && <p style={{ color: 'rgba(255,0,0,.8)' }}>{temporaryShip.invalidReason}</p>}
            </div>
          ) : (
            <Button style={{ marginRight: 0, lineHeight: 0.7, padding: '11px 8px' }} color="green" onClick={onPlaceSegments}>
              Place Segment(s)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
