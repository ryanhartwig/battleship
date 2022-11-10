import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { BoardAction } from '../../types/action';
import { DirectionalBomb } from '../../types/items';
import { getRange } from '../../utility/getRange';
import { fillRange } from '../../utility/previewHelpers';
import { Direction } from './AttackDetails';
import './Preview.css';
import { PreviewField } from './PreviewField';

interface PreviewProps {
  action: BoardAction;
  setAction: React.Dispatch<React.SetStateAction<BoardAction>>;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  direction: Direction;
  hitUser?: number;
}

export interface Coord {
  x: number;
  y: number;
}

export const Preview = ({ action, setAction, hitUser, selected, setSelected, direction }: PreviewProps) => {
  const [rangeX, setRangeX] = useState<number>(1);
  const [rangeY, setRangeY] = useState<number>(1);
  const items = useAppSelector((s) => s.game.store);
  const directionalBomb = useMemo(() => items.find((i) => i.type === 'directional') as DirectionalBomb, [items]);

  const coords: Coord[] = useMemo(() => {
    const { x, y } = action;
    const range = getRange(`${x}-${y}`, action.weapons[0], direction, directionalBomb);
    setRangeX(Math.max(range[0].x, range[1].x) - Math.min(range[0].x, range[1].x) + 1);
    setRangeY(Math.max(range[0].y, range[1].y) - Math.min(range[0].y, range[1].y) + 1);
    return fillRange([...range]);
  }, [action, direction, directionalBomb]);

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
          const hitIndex = next.hits.findIndex((h) => {
            if (!oX && !oY) {
              return !h.oX && !h.oY && h.userId === hitUser;
            }
            return h.oX === oX && h.oY === oY && h.userId === hitUser;
          });

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
      <div className="preview-fields-wrapper">
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
            return <PreviewField key={`${x}-${y}`} coords={{ x, y }} selected={selected} max={{ x: coords[coords.length - 1].x, y: coords[coords.length - 1].y }} action={action} />;
          })}
        </div>
      </div>
    </div>
  );
};
