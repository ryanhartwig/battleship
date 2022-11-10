import './Game.css';
import clsx from 'clsx';
import { Button, Header, Input, Menu, Modal, SemanticCOLORS } from 'semantic-ui-react';
import { useCallback, useEffect, useState } from 'react';
import { Board } from './Board';
import { ActionBar } from './ActionBar';
import { Upgrades } from './Upgrades';
import { Arsenal } from './Arsenal';
import { Players } from './players/Players';
import { Rules } from './Rules';
import { useOrientation } from '../hooks/useOrientation';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { initializeSettings, settingsInitialState, SettingsState } from '../reducers/settings/settingsSlice';
import { setSegments } from '../reducers/game/gameSlice';

type Tab = 'arsenal' | 'upgrades' | 'rules' | 'players';

const tabColors: Record<Tab, SemanticCOLORS> = {
  arsenal: 'blue',
  upgrades: 'green',
  rules: 'yellow',
  players: 'purple',
};

export const Game = () => {
  const dispatch = useAppDispatch();

  const [tab, setTab] = useState<Tab>('upgrades');
  const [settingsState, setSettingsState] = useState<SettingsState>({ ...settingsInitialState, initialized: true });

  const orientation = useOrientation();
  const initialized = useAppSelector((s) => s.settings.initialized);

  // On reset game, reset settings
  useEffect(() => {
    setSettingsState({ ...settingsInitialState, initialized: true });
  }, [initialized]);

  const onClose = useCallback(() => {
    dispatch(initializeSettings(settingsState));
    dispatch(setSegments(settingsState.startPieces));
  }, [dispatch, settingsState]);

  const onChange = useCallback((key: string, value: number) => {
    setSettingsState((s) => ({ ...s, [key]: value }));
  }, []);

  const createTabProps = (t: Tab) => {
    const active = tab === t;
    return {
      active,
      color: active ? tabColors[t] : 'black',
      onClick: () => setTab(t),
    };
  };

  return (
    <div className={clsx('main', { landscape: orientation === 'landscape' })}>
      {/* Initialize Modal */}
      <Modal open={!initialized} onClose={onClose}>
        <Modal.Header style={{ textAlign: 'center' }}>Welcome to battleship!</Modal.Header>
        <Modal.Content id="setup-form">
          <Header as="h3">Board starting size</Header>
          <Input
            type="number"
            value={settingsState.size}
            onChange={(e) => {
              onChange('size', Number(e.target.value));
            }}
          ></Input>
          <Header as="h3">Starting segments</Header>
          <Input
            type="number"
            value={settingsState.startPieces}
            onChange={(e) => {
              onChange('startPieces', Number(e.target.value));
            }}
          ></Input>
        </Modal.Content>
        <Modal.Actions style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={onClose} color="blue">
            Save
          </Button>
        </Modal.Actions>
      </Modal>

      <Board />

      <div className="main-content">
        <Menu inverted widths={4} style={{ borderRadius: 0, marginTop: 0, position: 'sticky', top: 0, zIndex: 1000 }}>
          <Menu.Item {...createTabProps('arsenal')}>Arsenal</Menu.Item>
          <Menu.Item {...createTabProps('upgrades')}>Upgrades</Menu.Item>
          <Menu.Item {...createTabProps('rules')}>Rules</Menu.Item>
          <Menu.Item {...createTabProps('players')}>Players</Menu.Item>
        </Menu>

        {tab === 'upgrades' && <Upgrades />}
        {tab === 'arsenal' && <Arsenal />}
        {tab === 'rules' && <Rules />}
        {tab === 'players' && <Players />}

        <ActionBar />
      </div>
    </div>
  );
};
