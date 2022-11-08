import { useMemo } from 'react';
import { BoardAction } from '../../types/action';
import { fillRange } from '../../utility/previewHelpers';
import './Preview.css';

interface PreviewProps {
  action: BoardAction;
}

export interface Coord {
  x: number;
  y: number;
}

export const Preview = ({ action }: PreviewProps) => {
  const coords: Coord[] = useMemo(() => {
    const { x, y } = action;
    let range: [Coord, Coord];
    switch (action.weapons[0]) {
      case 'missile':
        return [{ x, y }];
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
          { x, y: y + 9 },
        ];
        break;
    }
    return fillRange([...range]);
  }, [action]);

  return (
    <div className="preview-wrapper">
      <div
        className="attack-preview"
        style={
          {
            // gridTemplate
          }
        }
      ></div>
    </div>
  );
};
