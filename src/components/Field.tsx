import { useCallback, useState } from "react";
import './Field.css';

interface FieldProps {
  pieces: number;
  setPieces: React.Dispatch<React.SetStateAction<number>>;
  coords: { x: number, y: number }
}

export const Field = ({pieces, setPieces, coords}: FieldProps) => {

  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = useCallback((e: any) => {
    if (e._reactName === 'onMouseOver' && !e.buttons) return;
    if (pieces || (!pieces && clicked === true)) {
      setPieces((p) => clicked ? p + 1 : p - 1);
      setClicked((p) => !p);
    };
  }, [clicked, pieces, setPieces]);

  return (
    <>
      <div className={`field ${clicked ? 'clicked' : ''}`} onMouseDown={handleClick} onMouseOver={handleClick}>
        {/* <p className="coord">{coords.x}{coords.y}</p> */}
      </div>
    </>
    
  );
}