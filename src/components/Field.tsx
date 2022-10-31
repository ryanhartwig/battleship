import { useCallback, useState } from "react";
import './Field.css';
import { characters } from '../utility/data';

interface FieldProps {
  pieces: number;
  setPieces: React.Dispatch<React.SetStateAction<number>>;
  coords: { x: number, y: number };
  showCoords: boolean;
}

export const Field = ({pieces, setPieces, coords, showCoords}: FieldProps) => {

  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = useCallback((e: any) => {
    e.preventDefault();
    if (e._reactName === 'onMouseOver' && !e.buttons) return;
    if (pieces || (!pieces && clicked === true)) {
      setPieces((p) => clicked ? p + 1 : p - 1);
      setClicked((p) => !p);
    };
  }, [clicked, pieces, setPieces]);

  return (
    <>
      <div className={`field ${clicked ? 'clicked' : ''}`} onMouseDown={handleClick} onMouseOver={handleClick}>
        {showCoords ? <p className="coord">{characters[coords.x]}{coords.y}</p>
          : clicked ? '🚢' : ''}
      </div>
    </>
    
  );
}