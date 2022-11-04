import { useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import './ActionBar.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { saveTemporaryShip, togglePlaceMode } from '../store-state/game/gameSlice';

export const ActionBar = () => {
  const dispatch = useAppDispatch();

  const placeMode = useAppSelector((s) => s.game.placeMode);
  const temporaryShip = useAppSelector((s) => s.game.temporaryShip);

  const onPlaceSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch]);

  const onSave = useCallback(() => {
    dispatch(saveTemporaryShip());
  }, [dispatch]);

  return (
    <div className="action-bar">
      <div className="info-box">
        {placeMode ? (
          <>
            {temporaryShip?.invalidReason && <span style={{ color: 'rgba(255,0,0,0.6)', marginRight: '6px' }}>{temporaryShip.invalidReason}</span>}
            <Button secondary onClick={onPlaceSegments}>
              Cancel
            </Button>
            <Button primary disabled={!temporaryShip || temporaryShip.invalid} onClick={onSave}>
              Place
            </Button>
          </>
        ) : (
          <Button style={{ marginRight: 0 }} color="green" onClick={onPlaceSegments}>
            Place Segment(s)
          </Button>
        )}
      </div>
    </div>
  );
};
