import { Button, Segment } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import './Setup.css';
import { removeUser } from '../../reducers/game/gameSlice';
import { AddEditUser } from './AddEditUser';

export const Setup = () => {
  const dispatch = useAppDispatch();

  const { self, opponents } = useAppSelector((s) => s.game.users);

  return (
    <div className="setup-wrapper">
      <section className="setup-users">
        {/* Use container */}
        <Segment.Group>
          <Segment style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ verticalAlign: 'center' }}>
              {self[0]} <span>({self[1]})</span>
            </p>
            <Button size="mini">Edit</Button>
          </Segment>
        </Segment.Group>
        <Segment.Group raised>
          {opponents.map((player) => {
            return (
              <Segment key={player[2]} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>
                  {player[0]} <span>({player[1]})</span>
                </p>
                <div>
                  <Button
                    size="mini"
                    onClick={() => {
                      dispatch(removeUser(player[2]));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </Segment>
            );
          })}
        </Segment.Group>

        {/* Add user */}
        <AddEditUser />
      </section>
    </div>
  );
};
