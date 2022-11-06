import { Card, Container } from 'semantic-ui-react';
import './Rules.css';

export const Rules = () => {
  return (
    <Container>
      <Card style={{ width: '100%' }}>
        <Card.Content>
          <h2>Game Rules</h2>
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
          <h2>Lose Scenario</h2>
          <p>You lose the game when you have less than 3 segments on the board.</p>
          <h2>Extra Rules</h2>
          <ul>
            <li>Minimum ship size is 3</li>
            <li>Pillaged segments must be saved for the next turn</li>
            <li>If you defeat a player, you receive all their money</li>
            <li>Can not fire on damaged tiles</li>
          </ul>
        </Card.Content>
      </Card>
    </Container>
  );
};
