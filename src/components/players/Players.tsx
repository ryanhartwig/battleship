import { Button, Container, Segment } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import './Players.css';
import { removeUser } from '../../reducers/game/gameSlice';
import { AddEditUser } from './AddEditUser';

export const Players = () => {
  const dispatch = useAppDispatch();
  const actions = useAppSelector((s) => s.game.actions);

  const { self, opponents } = useAppSelector((s) => s.game.users);

  return (
    <div className="setup-wrapper">
      <section className="setup-users">
        {/* Use container */}
        <Container>
          <Segment.Group>
            <Segment style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ verticalAlign: 'center' }}>
                {self.name} <span>({self.initial})</span>
              </p>
              {/* Edit user modal */}
              <AddEditUser add={false} />
            </Segment>
          </Segment.Group>
        </Container>

        <Container style={{ margin: '20px 0' }}>
          <Segment.Group raised>
            {opponents.map((player) => {
              return (
                <Segment key={player.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p>
                    {player.name} <span>({player.initial})</span>
                  </p>
                  <div>
                    <Button
                      size="mini"
                      disabled={!!actions.length}
                      onClick={() => {
                        dispatch(removeUser(player.id));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Segment>
              );
            })}
          </Segment.Group>
        </Container>

        {/* Add user */}
        <div style={{ margin: '0 auto', width: 'fit-content' }}>
          <AddEditUser add />
        </div>
      </section>
    </div>
  );
};
