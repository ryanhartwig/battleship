import React, { useCallback, useState } from "react";
import './Field.css';
import { characters } from '../utility/data';
import { selectSettings, setStartPieces } from "../store-state/settings/settingsSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/hooks";

interface FieldProps {
  coords: { x: number, y: number };
  showCoords: boolean;
  pieces: number;
  setPieces: React.Dispatch<React.SetStateAction<number>>;
}

export const Field = ({pieces, setPieces, coords, showCoords}: FieldProps) => {
  
  const {x, y} = coords;
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
      <div 
      style={{gridArea: `${y} / ${x} / ${y} / ${x}`}}
      className={`field ${clicked ? 'clicked' : ''}`} onMouseDown={handleClick} onMouseOver={handleClick}>
        {showCoords ? <p className="coord">{coords.x},{coords.y}</p>
          : clicked ? '🚢' : ''}
      </div>
    </>
    
  );
}