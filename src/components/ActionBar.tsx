import { useCallback, useMemo, useState } from 'react';
import { Button, Label, Modal } from 'semantic-ui-react';
import './ActionBar.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { calculateIncome } from '../utility/calculateIncome';
import { toggleShipVisibility, togglePlaceMode, saveTemporaryShip, takeIncome } from '../reducers/game/gameSlice';

export const ActionBar = () => {
  const dispatch = useAppDispatch();

  const placeMode = useAppSelector((s) => s.game.placeMode);
  const ships = useAppSelector((s) => s.game.ships);
  const actions = useAppSelector((s) => s.game.actions);
  const temporaryShip = useAppSelector((s) => s.game.temporaryShip);
  const minimumIncome = useAppSelector((s) => s.settings.minimumIncome);
  const [openIncomeConfirmation, setOpenIncomeConfirmation] = useState(false);

  const cash = useAppSelector((s) => s.game.cash);

  const income = useMemo(() => {
    return calculateIncome(ships, actions, minimumIncome);
  }, [ships, actions, minimumIncome]);

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
    setOpenIncomeConfirmation(true);
  }, []);

  const onConfirmIncome = useCallback(() => {
    dispatch(takeIncome(minimumIncome));
    setOpenIncomeConfirmation(false);
  }, [dispatch, minimumIncome]);

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

        <Modal open={openIncomeConfirmation} onClose={() => setOpenIncomeConfirmation(false)}>
          <Modal.Header>Confirm Income</Modal.Header>
          <Modal.Content>You only take income at the start of your turn. Make sure it's your turn!</Modal.Content>
          <Modal.Actions>
            <Button secondary onClick={() => setOpenIncomeConfirmation(false)}>
              Cancel
            </Button>
            <Button primary onClick={onConfirmIncome}>
              Take Income
            </Button>
          </Modal.Actions>
        </Modal>

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
