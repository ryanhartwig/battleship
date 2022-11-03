import clsx from 'clsx';
import './Field.css';
import { useAppSelector } from '../app/hooks';
import { useMemo } from 'react';
import { Label } from 'semantic-ui-react';

interface FieldProps {
  coords: { x: number; y: number };
}

export const Field = ({ coords }: FieldProps) => {
  const { x, y } = coords;
  const size = useAppSelector((s) => s.settings.size);
  const movementLevel = useAppSelector((s) => s.game.levels.movement);
  const disabled = useMemo(() => {
    const range = movementLevel + size;
    return x > range || y > range;
  }, [x, y, movementLevel, size]);

  return (
    <div
      id={`${x}-${y}`}
      style={{
        gridArea: `${y} / ${x} / ${y} / ${x}`,
      }}
      className={clsx('field', { disabled })}
    >
      {x === 1 && (
        <Label className={`field-label y`} style={{ left: '-22px' }}>
          {String.fromCharCode(y + 64)}
        </Label>
      )}
      {y === 1 && (
        <Label className={`field-label x`} style={{ top: '-22px' }}>
          {x}
        </Label>
      )}
    </div>
  );
};
