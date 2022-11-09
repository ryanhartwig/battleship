import clsx from 'clsx';
import { characters } from '../../utility/data';
import { Coord } from './Preview';
import './PreviewField.css';

interface PreviewFieldProps {
  coords: Coord;
  selected: string;
  max: Coord;
}

export const PreviewField = ({ coords, selected, max }: PreviewFieldProps) => {
  const { x, y } = coords;

  return (
    <div id={`preview_${x}-${y}`} className={clsx('preview-field', { selected: selected === `${x}-${y}`, right: max.x === x, bottom: max.y === y })}>
      {/* Top (Attacker) */}
      <div></div>

      {/* Coordinates */}
      <div>
        <p>
          {characters[y]}
          {x}
        </p>
      </div>

      {/* Players Hit */}
      <div></div>
    </div>
  );
};
