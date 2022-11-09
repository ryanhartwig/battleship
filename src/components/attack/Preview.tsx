import React, { useCallback, useMemo, useState } from 'react';
import { BoardAction } from '../../types/action';
import { fillRange } from '../../utility/previewHelpers';
import './Preview.css';
import { PreviewField } from './PreviewField';

interface PreviewProps {
  action: BoardAction;
}

export interface Coord {
  x: number;
  y: number;
}

export const Preview = ({ action }: PreviewProps) => {
  const [rangeX, setRangeX] = useState<number>(1);
  const [rangeY, setRangeY] = useState<number>(1);

  const [selected, setSelected] = useState<string>(`${action.x}-${action.y}`);

  const coords: Coord[] = useMemo(() => {
    const { x, y } = action;
    let range: [Coord, Coord];
    switch (action.weapons[0]) {
      case 'missile':
        range = [
          { x, y },
          { x, y },
        ];
        break;
      case 'bomb':
        range = [
          { x: x - 1, y: y - 1 },
          { x: x + 1, y: y + 1 },
        ];
        break;
      case 'atomic':
        range = [
          { x: x - 2, y: y - 2 },
          { x: x + 2, y: y + 2 },
        ];
        break;
      case 'directional':
        range = [
          { x, y },
          { x: x + 8, y },
        ];
        break;
    }
    setRangeX(Math.max(range[0].x, range[1].x) - Math.min(range[0].x, range[1].x) + 1);
    setRangeY(Math.max(range[0].y, range[1].y) - Math.min(range[0].y, range[1].y) + 1);
    return fillRange([...range]);
  }, [action]);

  const handleSelectField = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const field = e.target;
      if (!(field instanceof HTMLDivElement)) return;
      const id = field.id.split('_')[1];
      if (id === selected) return;

      setSelected(id);
    },
    [selected]
  );

  return (
    <div className="preview-wrapper">
      <div
        className="attack-preview"
        style={{
          gridTemplateColumns: `repeat(${rangeX}, 1fr)`,
          gridTemplateRows: `repeat(${rangeY})`,
        }}
        onClick={handleSelectField}
      >
        {coords.map((coord) => {
          const { x, y } = coord;
          return <PreviewField coords={{ x, y }} selected={selected} max={{ x: coords[coords.length - 1].x, y: coords[coords.length - 1].y }} action={action} />;
        })}
      </div>
    </div>
  );
};
