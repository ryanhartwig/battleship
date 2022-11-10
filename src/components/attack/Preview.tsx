import React, { useCallback, useMemo, useState } from 'react';
import { BoardAction } from '../../types/action';
import { fillRange } from '../../utility/previewHelpers';
import './Preview.css';
import { PreviewField } from './PreviewField';

interface PreviewProps {
  action: BoardAction;
  setAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  hitUser?: number;
}

export interface Coord {
  x: number;
  y: number;
}

export const Preview = ({ action, setAction, hitUser, selected, setSelected }: PreviewProps) => {
  const [rangeX, setRangeX] = useState<number>(1);
  const [rangeY, setRangeY] = useState<number>(1);

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

  const onSelectField = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const field = e.target;
      if (!(field instanceof HTMLDivElement)) return;
      const id = field.id.split('_')[1];
      const [fX, fY] = id.split('-').map((i) => Number(i));

      let oX: number | undefined = fX - action.x || undefined;
      let oY: number | undefined = fY - action.y || undefined;

      if (hitUser) {
        setAction((a) => {
          const next: BoardAction = JSON.parse(JSON.stringify(a));
          console.log(next.hits);
          const hitIndex = next.hits.findIndex((h) => {
            console.log(h.userId === hitUser);
            if (!oX && !oY) {
              return !h.oX && !h.oY && h.userId === hitUser;
            }
            return h.oX === oX && h.oY === oY && h.userId === hitUser;
          });

          console.log(hitIndex);

          if (hitIndex === -1) {
            [oX, oY] = [oX === 0 ? undefined : oX, oY === 0 ? undefined : oY];
            next.hits.push({ userId: hitUser, oX, oY });
          } else {
            next.hits = next.hits.slice(0, hitIndex).concat(next.hits.slice(hitIndex + 1));
          }

          return next;
        });
      }
      // Sets selected to cell coordinates in preview_x-y format
      if (id === selected) return;
      setSelected(id);
    },
    [action.x, action.y, hitUser, selected, setSelected, setAction]
  );

  return (
    <div className="preview-wrapper">
      <div
        className="attack-preview"
        style={{
          gridTemplateColumns: `repeat(${rangeX}, 1fr)`,
          gridTemplateRows: `repeat(${rangeY})`,
        }}
        onClick={onSelectField}
      >
        {coords.map((coord) => {
          const { x, y } = coord;
          return <PreviewField coords={{ x, y }} selected={selected} max={{ x: coords[coords.length - 1].x, y: coords[coords.length - 1].y }} action={action} />;
        })}
      </div>
    </div>
  );
};
