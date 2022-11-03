import { useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import './ActionBar.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { togglePlaceMode } from '../store-state/game/gameSlice';

export const ActionBar = () => {
  const dispatch = useAppDispatch();

  const placeMode = useAppSelector((s) => s.game.placeMode);

  const placeSegments = useCallback(() => {
    dispatch(togglePlaceMode());
  }, [dispatch]);

  return (
    <div className="action-bar">
      <div className="info-box">
        <Button color={placeMode ? 'green' : undefined} onClick={placeSegments}>
          Create Ship
        </Button>
      </div>
    </div>
  );
};
