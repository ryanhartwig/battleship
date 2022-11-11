import { Button, Card, Container } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import './Arsenal.css';
import { itemIcons } from '../utility/storeIcons';
import { useCallback, useMemo } from 'react';
import { buyItem, skipTurn } from '../reducers/game/gameSlice';
import { c } from '../utility/c';

export const Arsenal = () => {
  const dispatch = useAppDispatch();
  const storeItems = useAppSelector((state) => state.game.store);
  const items = useMemo(() => {
    return storeItems.filter((i) => i.type !== 'missile');
  }, [storeItems]);
  const shipLevel = useAppSelector((state) => state.game.levels.ship);

  const cash = useAppSelector((s) => s.game.cash);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const element = e.target;
      if (!(element instanceof HTMLButtonElement)) return;

      dispatch(buyItem(element.title));
    },
    [dispatch]
  );

  const skip = useAppSelector((s) => s.game.skip);

  const onSkipTurn = useCallback(() => {
    dispatch(skipTurn());
  }, [dispatch]);

  const skipDisabled = c(cash - skip) < 0;
  return (
    <Container style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'column' }}>
      <Button inverted color={skipDisabled ? 'red' : 'green'} onClick={onSkipTurn} disabled={skipDisabled}>
        Skip Turn (${skip})
      </Button>
      <div className="store" style={{ marginTop: '10px' }}>
        {items.map((item) => {
          const Icon = itemIcons[item.type];
          let style = item.type === 'directional' ? { transform: 'rotate(270deg)' } : undefined;
          let disabled = c(cash - item.cost) < 0;
          if (item.type === 'segment') {
            disabled = c(cash - (item.cost - shipLevel)) < 0;
          }
          return (
            <Card key={item.type} className="store-item" style={{ width: '180px', height: '180px' }}>
              <Card.Content>
                <Card.Header style={{ textAlign: 'center', fontSize: '1rem' }}>{item.name}</Card.Header>
                <Card.Description className="store-item-content-wrapper" style={{ position: 'relative', margin: '0' }}>
                  <div className="store-item-icon">
                    <Icon style={style} />
                  </div>
                  <div className="store-item-description">{item.description}</div>
                </Card.Description>
              </Card.Content>
              <Card.Content extra style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button disabled={disabled} title={item.type} onClick={onClick} basic color={disabled ? 'red' : 'green'}>
                  Purchase (${item.type === 'segment' ? item.cost - shipLevel : item.cost})
                </Button>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};
