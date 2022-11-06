import { useCallback, useEffect, useState } from 'react';
import { Button, Input, Modal, Segment } from 'semantic-ui-react';
import { useAppSelector } from '../../app/hooks';
import './Setup.css';

export const Setup = () => {
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

  const addPlayer = useCallback(() => {}, []);

  return (
    <div className="setup-wrapper">
      <section className="setup-users">
        {/* Use container */}
        <Segment.Group>
          <Segment>{self[0]}</Segment>
        </Segment.Group>
        <Segment.Group raised>
          {opponents.map((player) => {
            return <Segment>{player[0]}</Segment>;
          })}
        </Segment.Group>

        {/* Add user */}
        <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={<Button>Add User</Button>}>
          <Modal.Header>Add User</Modal.Header>
          <Modal.Content>
            <form style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <div className="button-label">
                <label htmlFor="setup-users-name">Name: </label>
                <Input onChange={(e) => setName(e.target.value)} id="setup-users-name" placeholder="Player name" value={name} required></Input>
              </div>
              <div className="button-label">
                <label htmlFor="setup-users-initial">Initial: </label>
                <Input onChange={(e) => setInitial(e.target.value)} placeholder={placeholder.toString()} id="setup-users-initial" value={initial}></Input>
              </div>
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
