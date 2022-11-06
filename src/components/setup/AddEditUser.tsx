import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Input } from 'semantic-ui-react';
import { useAppDispatch } from '../../app/hooks';
import { addUser } from '../../reducers/game/gameSlice';

interface AddEditUserProps {
  add?: boolean;
}

export const AddEditUser = ({ add = false }: AddEditUserProps) => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [initial, setInitial] = useState<string>('');

  const addPlayer = useCallback(() => {
    if (add) {
      dispatch(addUser([name, initial || placeholder]));
    }

    setName('');
    setPlaceholder('');
    setInitial('');
  }, [dispatch, name, initial, placeholder, add]);

  // Set initials (placeholder)
  useEffect(() => {
    if (name) {
      const split = name.split(' ');
      const first = split[0][0];
      const last = split.length > 1 ? split[split.length - 1][0] : undefined;
      setPlaceholder(`${first}${last?.length ? last : ''}`);
    }
  }, [name]);

  return (
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
  );
};
