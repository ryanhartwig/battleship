import clsx from "clsx";
import './Field.css';
import { useAppSelector } from "../app/hooks";
import { useMemo } from "react";
import { Label } from "semantic-ui-react";

interface FieldProps {
  coords: { x: number, y: number };
  showCoords: boolean;
}

export const Field = ({coords, showCoords}: FieldProps) => {
  const {x, y} = coords;
  const size = useAppSelector(s => s.settings.size)
  const movementLevel = useAppSelector(s => s.game.movementLevel)
  const disabled = useMemo(() => {
    const range = movementLevel + size
    return x > range || y > range
  }, [x, y, movementLevel, size])

  return (
    <div 
      id={`${x}-${y}`}
      style={{gridArea: `${y} / ${x} / ${y} / ${x}`}}
      className={clsx('field', { disabled })}
    >
      {showCoords && (<Label style={{ padding: '2px' }} color="grey"><p className="coord">({coords.x},{coords.y})</p></Label>)}
    </div>
  );
}