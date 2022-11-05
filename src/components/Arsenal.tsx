import { Card, Icon } from 'semantic-ui-react';
import { useAppSelector } from '../app/hooks';
import './Arsenal.css';

export const Arsenal = () => {
  const items = useAppSelector((state) => state.game.store);
  const shipLevel = useAppSelector((state) => state.game.levels.ship);

  return (
    <div className="store">
      {items.map((item) => {
        return (
          <Card className="store-item" style={{ maxWidth: '33%' }}>
            <Card.Content>
              <Card.Header>{item.type}</Card.Header>

              <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="user" />
                22 Friends
              </a>
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
};
