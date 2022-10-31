import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { Ship } from "../types/ship";

export const useEditShip = () => {
  
  const placing = useAppSelector((state) => state.game.placeMode);
  const startCoordsRef = useRef<number[]>([]);
  const endCoordsRef = useRef<number[]>([]);
  const [workingCoords, setWorkingCoords] = useState<[number, number][]>([]);
  const [dragging, setDragging] = useState<boolean>(false);
  const maxLength = useAppSelector((state) => state.settings.maxShipLength) -1;

  useEffect(() => {
    setWorkingCoords([])
  }, [placing])

  const onMouseOver = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const field = e.target as HTMLDivElement
    if (!placing || !field.className.includes('field')) {
      return;
    }
    const [x, y] = field.id.split('-').map((n: any) => Number(n))
    endCoordsRef.current = [x, y];

    if (!dragging) {
      return;
    }

    let [x1, y1] = startCoordsRef.current;
    let [x2, y2] = endCoordsRef.current;

    let xRange = Math.max(x1, x2) - Math.min(x1, x2);
    let yRange = Math.max(y1, y2) - Math.min(y1, y2);

    if (xRange > yRange) { 
      setWorkingCoords([[x1, y1], [x2, y1]]);
    } else {
      setWorkingCoords([[x1, y1], [x1, y2]]);
    }
  }, [dragging, workingCoords, placing]);

  const temporaryShip = useMemo((): Ship | undefined => {
    if (!workingCoords.length) return;
    let [[x1, y1], [x2, y2]] = workingCoords;
    let xRange = Math.max(x1, x2) - Math.min(x1, x2);
    let yRange = Math.max(y1, y2) - Math.min(y1, y2);
    return {
      id: Date.now(),
      invalid: (xRange > maxLength || yRange > maxLength) || Math.max(xRange, yRange) < 2,
      segments: [{ x: x1, y: y1, originalCost: 10 }, { x: x2, y: y2, originalCost: 10 }] 
    }
  }, [workingCoords])

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!placing) return;
    // e.preventDefault();
    const [x, y] = (e.target as HTMLDivElement).id.split('-').map((n: string) => Number(n));
    startCoordsRef.current = [x, y];
    setDragging(true);
  }, [placing]);

  const onExit = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!placing) return;
    setDragging(false);
  }, [placing]);

  return {
    onMouseDown,
    onMouseOver,
    onExit,
    temporaryShip,
  }
};
