import { Button, Card } from 'semantic-ui-react';
import { useAppSelector } from '../app/hooks';
import './Arsenal.css';
import { itemIcons } from '../utility/storeIcons';
import { useCallback } from 'react';

export const Arsenal = () => {
  const items = useAppSelector((state) => state.game.store);
  const shipLevel = useAppSelector((state) => state.game.levels.ship);

  const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const element = e.target;
    if (!(element instanceof HTMLAnchorElement)) return;
  }, []);

  return (
    <div className="store">
      {items.map((item) => {
        const Icon = itemIcons[item.type];
        return (
          <Card className="store-item" style={{ width: '180px', height: '180px' }}>
            <Card.Content>
              <Card.Header style={{ textAlign: 'center', fontSize: '1rem' }}>{item.name}</Card.Header>
              <Card.Description className="store-item-content-wrapper" style={{ position: 'relative', margin: '0' }}>
                <div className="store-item-icon">
                  <Icon />
                </div>
                <div className="store-item-description">{item.description}</div>
              </Card.Description>
            </Card.Content>
            <Card.Content extra style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button basic color="olive">
                Purchase (${item.type === 'segment' ? item.cost - shipLevel : item.cost})
              </Button>
            </Card.Content>
          </Card>
        );
      })}
    </div>
  );
};
