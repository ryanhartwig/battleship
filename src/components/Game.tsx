import './Game.css';
import { Menu, SemanticCOLORS } from 'semantic-ui-react';
import { useState } from 'react';
import { Board } from './Board';
import { ActionBar } from './ActionBar';
import { Upgrades } from './Upgrades';

type Tab = 'store' | 'upgrades' | 'rules';

const tabColors: Record<Tab, SemanticCOLORS> = {
  store: 'blue',
  upgrades: 'green',
  rules: 'yellow',
};

export const Game = () => {
  const [tab, setTab] = useState<Tab>('upgrades');

  const createTabProps = (t: Tab) => {
    const active = tab === t;
    return {
      active,
      color: active ? tabColors[t] : 'black',
      onClick: () => setTab(t),
    };
  };

  return (
    <div className="main">
      <Board />

      <div className="main-content">
        <Menu inverted widths={3} style={{ borderRadius: 0, marginTop: 0, position: 'sticky', top: 0, zIndex: 1000 }}>
          <Menu.Item {...createTabProps('store')}>Store</Menu.Item>
          <Menu.Item {...createTabProps('upgrades')}>Upgrades</Menu.Item>
          <Menu.Item {...createTabProps('rules')}>Rules</Menu.Item>
        </Menu>
        {tab === 'upgrades' && <Upgrades />}
      </div>

      <ActionBar />
    </div>
  );
};