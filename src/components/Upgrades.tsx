import { useCallback } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { buyUpgrade, UpgradeLevel } from '../store-state/game/gameSlice';
import './Upgrades.css';

export const Upgrades = () => {
  const dispatch = useAppDispatch();

  const upgrades = useAppSelector((s) => s.settings.upgrades);
  const settings = useAppSelector((s) => s.settings);
  const levels = useAppSelector((s) => s.game.levels);

  const onUpgrade = useCallback(
    (upgrade: UpgradeLevel) => {
      try {
        dispatch(buyUpgrade([upgrade, settings]));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, settings]
  );

  return (
    <div className="upgrade-wrapper">
      <div className="upgrades">
        <Header as="h3">Ship (Level {levels.ship})</Header>
        <Menu size="mini" vertical fluid>
          {upgrades.ship.map((ship, i) => {
            if (i < levels.ship) {
              return <div key={i}></div>;
            }
            return (
              <Menu.Item
                active={i === levels.ship}
                {...(i === levels.ship + 1
                  ? {
                      onClick: () => onUpgrade('ship'),
                    }
                  : {})}
                key={i}
              >
                <strong>Level {i}</strong>
                <br />
                <span style={{ fontSize: '10px' }}>
                  Ship Segments purchaseable for <strong>${ship.segmentCost.toFixed(0)}</strong>
                </span>
                <br />
                <br />
                <strong>Cost: ${ship.cost}</strong>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      <div className="upgrades">
        <Header as="h3">Pillage (Level {levels.pillage})</Header>
        <Menu size="mini" vertical fluid>
          {upgrades.pillage.map((pillage, i) => {
            if (i < levels.pillage) {
              return <div key={i}></div>;
            }
            return (
              <Menu.Item
                active={i === levels.pillage}
                key={i}
                {...(i === levels.pillage + 1
                  ? {
                      onClick: () => onUpgrade('pillage'),
                    }
                  : {})}
              >
                <strong>Level {i}</strong>
                <br />
                <span style={{ fontSize: '10px' }}>
                  <strong>${pillage.earningsPerSegment}</strong> per segment killed, <strong>{pillage.segmentRewardOnSink}</strong> segment per sunk ship
                </span>
                <br />
                <br />
                <strong>Cost: ${pillage.cost}</strong>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      <div className="upgrades">
        <Header as="h3">Movement (Level {levels.movement})</Header>
        <Menu size="mini" vertical fluid>
          {upgrades.move.map((movement, i) => {
            if (i < levels.movement) {
              return <div key={i}></div>;
            }
            return (
              <Menu.Item
                active={i === levels.movement}
                key={i}
                {...(i === levels.movement + 1
                  ? {
                      onClick: () => onUpgrade('movement'),
                    }
                  : {})}
              >
                <strong>Level {i}</strong>
                <br />
                <span style={{ fontSize: '10px' }}>Expands board 1 additional square</span>
                <br />
                <br />
                <strong>Cost: ${movement.cost}</strong>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
      <div className="upgrades">
        <Header as="h3">Range (Level {levels.range})</Header>
        <Menu size="mini" vertical fluid>
          {upgrades.range.map((range, i) => {
            if (i < levels.range) {
              return <div key={i}></div>;
            }
            return (
              <Menu.Item
                active={i === levels.range}
                key={i}
                {...(i === levels.range + 1
                  ? {
                      onClick: () => onUpgrade('range'),
                    }
                  : {})}
              >
                <strong>Level {i}</strong>
                <br />
                <span style={{ fontSize: '10px' }}>Ship can shoot {range.attackRange} squares away</span>
                <br />
                <br />
                <strong>Cost: ${range.cost}</strong>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};
