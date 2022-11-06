import { useCallback, useEffect, useState } from 'react';
import { Button, Input, Modal, Segment } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import './Setup.css';
import { addUser, removeUser } from '../../reducers/game/gameSlice';

export const Setup = () => {
  const dispatch = useAppDispatch();

  const { self, opponents } = useAppSelector((s) => s.game.users);

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [initial, setInitial] = useState<string>('');

  useEffect(() => {
    if (name) {
      const split = name.split(' ');
      const first = split[0][0];
      const last = split.length > 1 ? split[split.length - 1][0] : undefined;
      setPlaceholder(`${first}${last?.length ? last : ''}`);
    }
  }, [name]);

  const addPlayer = useCallback(() => {
    dispatch(addUser([name, initial || placeholder]));
    setName('');
    setPlaceholder('');
    setInitial('');
  }, [dispatch, name, initial, placeholder]);

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
        <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={<Button>Add User</Button>}>
          <Modal.Header>Add User</Modal.Header>
          <Modal.Content>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPlayer();
              }}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              <div className="setup-users-fields">
                <div className="button-label">
                  <label htmlFor="setup-users-name">Name: </label>
                  <Input onChange={(e) => setName(e.target.value)} id="setup-users-name" placeholder="Player name" value={name} required></Input>
                </div>
                <div className="button-label">
                  <label htmlFor="setup-users-initial">Initial: </label>
                  <Input maxLength="2" onChange={(e) => setInitial(e.target.value)} placeholder={placeholder.toString()} id="setup-users-initial" value={initial}></Input>
                </div>
              </div>

              <Button type="submit">Add</Button>
            </form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="grey" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </section>
    </div>
  );
};
