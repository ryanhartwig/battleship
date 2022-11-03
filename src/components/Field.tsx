import clsx from "clsx";
import './Field.css';
import { useAppSelector } from "../app/hooks";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Label } from "semantic-ui-react";

interface FieldProps {
  coords: { x: number, y: number };
}

export const Field = ({coords}: FieldProps) => {
  const {x, y} = coords;
  const div = useRef<HTMLDivElement>(undefined!)
  const size = useAppSelector(s => s.settings.size)
  const movementLevel = useAppSelector(s => s.game.movementLevel)
  const [offset, setOffset] = useState(0)
  const disabled = useMemo(() => {
    const range = movementLevel + size
    return x > range || y > range
  }, [x, y, movementLevel, size])

  // Find label locations
  useLayoutEffect(() => {
    if (x !== 1 && y !== 1) {
      return;
    }

    if (x === 1) {
      const width = div.current.getBoundingClientRect().width
      setOffset(0 - width / 2)
    }

    if (y === 1) {
      const height = div.current.getBoundingClientRect().height
      setOffset(0 - height / 2)
    }
  }, [x, y])

  return (
    <div 
      id={`${x}-${y}`}
      style={{
        gridArea: `${y} / ${x} / ${y} / ${x}`
      }}
      className={clsx('field', { disabled })}
      ref={div}
    >
      {x === 1 && <Label className="field-label" style={{ left: offset }}>{String.fromCharCode(y + 64)}</Label>}
      {y === 1 && <Label className="field-label" style={{ top: offset }}>{x}</Label>}
    </div>
  );
}