import { useCallback } from 'react';
import { Button, Label } from 'semantic-ui-react';
import './ActionBar.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { saveTemporaryShip, togglePlaceMode } from '../reducers/game/gameSlice';

export const ActionBar = () => {
  const dispatch = useAppDispatch();

  const placeMode = useAppSelector((s) => s.game.placeMode);
  const temporaryShip = useAppSelector((s) => s.game.temporaryShip);

  const cash = useAppSelector((s) => s.game.cash);

  const onPlaceSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch]);

  const onSave = useCallback(() => {
    dispatch(saveTemporaryShip());
  }, [dispatch]);

  return (
    <div className="action-bar">
      <div className="info-box">
        {/* Left */}
        {!placeMode && (
          <div>
            <Label className="action-label" color="green">
              <p>Cash: ${cash}</p>
            </Label>
            <Label className="action-label" color="purple">
              <p>Income: ${cash}</p>
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
              {temporaryShip?.invalidReason && <p style={{ color: 'rgba(255,0,0,.8)', maxHeight: '100%', height: 'fit-content', marginBottom: '6px' }}>{temporaryShip.invalidReason}</p>}
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
