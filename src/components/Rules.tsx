import { useCallback } from 'react';
import { Button, Card, Container, Table } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { resetSlice } from '../reducers/game/gameSlice';
import { resetSettings } from '../reducers/settings/settingsSlice';
import './Rules.css';

export const Rules = () => {
  const dispatch = useAppDispatch();
  const version = useAppSelector((s) => s.game.version);
  const sversion = useAppSelector((s) => s.settings.version);
  const minInc = useAppSelector((s) => s.settings.minimumIncome);
  const onReset = useCallback(() => {
    dispatch(resetSlice());
    dispatch(resetSettings());
  }, [dispatch]);
  return (
    <Container>
      <Card style={{ width: '100%' }}>
        <Card.Content>
          <h2>
            Game Rules (v1.{version}.{sversion})
          </h2>
          <h2>Your Turn</h2>
          <p>Your turn is broken into 2 phases:</p>
          <ul>
            <li>Buy Phase</li>
            <li>Attack Phase</li>
          </ul>
          <h4>Buy Phase</h4>
          <p>Use this time to purchase upgrades and items from the store. You must announce all items purchased to everyone playing.</p>
          <h4>Attack Phase</h4>
          <p>
            You may choose one tile to attack. This attack must be only <strong>1 Tile</strong> away from your ships (Including diagonally). If you use any weapons, you must announce what weapons are being used. <strong>Landing a hit allows you to attack again!</strong>
          </p>
          <p>Attack range can be upgraded in the Upgrades menu</p>
          <p>
            You may also choose to pay to pass your turn. Each turn that you pass increases the cost by <strong>$1</strong>, so use it sparingly! Skipping the attack phase can be helpful to hide the location of your ships!
          </p>
          <p>You may choose to attack a square you belong to. If you do, you must announce that you have hit your own ship.</p>
          <h2>Income</h2>
          <p>
            Minimum income: <strong>${minInc.toFixed(2)}</strong>
          </p>
          <p>
            Ships of varying lengths contribute more to your income. The calculation is as follows.
            <br />
            <strong>Note:</strong> damaged ships are broken (income wise) into multiple ships. If one of said segments is less than 3 segments, income is $1 per segment remaining.
            <br />
            <strong>Example:</strong> a ship of length 7, that provides $15 income, when shot in the 3rd segment, would provide (2x1 + 1x6) income.
          </p>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>3</Table.HeaderCell>
                <Table.HeaderCell>4</Table.HeaderCell>
                <Table.HeaderCell>5</Table.HeaderCell>
                <Table.HeaderCell>6</Table.HeaderCell>
                <Table.HeaderCell>7</Table.HeaderCell>
                <Table.HeaderCell>8</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>$3.00</Table.Cell>
                <Table.Cell>$6.00</Table.Cell>
                <Table.Cell>$9.00</Table.Cell>
                <Table.Cell>$12.00</Table.Cell>
                <Table.Cell>$15.00</Table.Cell>
                <Table.Cell>$18.00</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <h2>Lose Scenario</h2>
          <p>You lose the game when you have less than 3 segments on the board.</p>
          <h2>Extra Rules</h2>
          <ul>
            <li>Minimum ship size is 3</li>
            <li>Pillaged segments must be saved for the next turn</li>
            <li>If you defeat a player, you receive all their money</li>
            <li>Can not fire on damaged tiles</li>
          </ul>
          <Button color="yellow" onClick={onReset}>
            Reset Game
          </Button>
        </Card.Content>
      </Card>
    </Container>
  );
};
