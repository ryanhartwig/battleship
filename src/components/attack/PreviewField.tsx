import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useGetUsers } from '../../hooks/useGetUser';
import { BoardAction } from '../../types/action';
import { characters } from '../../utility/data';
import { Coord } from './Preview';
import './PreviewField.css';

interface PreviewFieldProps {
  coords: Coord;
  selected: string;
  max: Coord;
  action: BoardAction;
}

export const PreviewField = ({ coords, selected, max, action }: PreviewFieldProps) => {
  const hitUsers: number[] = useMemo(() => {
    return action.hits
      .filter((hit) => {
        const wX = action.x + (hit.oX || 0);
        const wY = action.y + (hit.oY || 0);

        return wX === coords.x && wY === coords.y;
      })
      .map((h) => h.userId);
  }, [action, coords]);

  const { x, y } = coords;

  const hits = useGetUsers(hitUsers);

  const isSunk = useCallback(
    (id: number) => {
      return !!action.hits.find((hit) => {
        return (coords.x - action.x || undefined) === hit.oX && (coords.y - action.y || undefined) === hit.oY && hit.userId === id;
      })?.sunk;
    },
    [action.hits, action.x, action.y, coords.x, coords.y]
  );

  return (
    <div id={`preview_${x}-${y}`} className={clsx('preview-field', { selected: selected === `${x}-${y}`, right: max.x === x, bottom: max.y === y })}>
      {/* Coordinates */}
      <div>
        <p>
          {characters[y]}
          {x}
        </p>
      </div>

      {/* Players Hit */}
      {!!hits.length ? (
        <div>
          <p>
            {hits.map((u) => (
              <span className={clsx('preview-hit', { sunk: isSunk(u.id) })}>{u.initial} </span>
            ))}
          </p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
