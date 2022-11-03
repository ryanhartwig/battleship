import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setTemporaryShip } from '../store-state/game/gameSlice';
import { Ship } from '../types/ship';

export const useEditShip = () => {
  const placing = useAppSelector((state) => state.game.placeMode);
  const remainingSegments = useAppSelector((state) => state.game.segments);
  const startCoordsRef = useRef<number[]>([]);
  const endCoordsRef = useRef<number[]>([]);
  const [workingCoords, setWorkingCoords] = useState<[number, number][]>([]);
  const [dragging, setDragging] = useState<boolean>(false);
  const maxLength = useAppSelector((state) => state.settings.maxShipLength) - 1;
  const dispatch = useAppDispatch();

  const ships = useAppSelector((state) => state.game.ships);

  const segmentsHash = useMemo(() => {
    const result = new Set();
    ships.forEach((ship) => {
      ship.segments.forEach((segment) => {
        result.add(`${segment.x}-${segment.y}`);
      });
    });
    return result;
  }, [ships]);

  useEffect(() => {
    setWorkingCoords([]);
  }, [placing]);

  const onMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const field = e.target as HTMLDivElement;
      if (!dragging || !placing || !field.className.includes('field')) {
        return;
      }

      const [x, y] = field.id.split('-').map((n: any) => Number(n));
      endCoordsRef.current = [x, y];

      let [x1, y1] = startCoordsRef.current;
      let [x2, y2] = endCoordsRef.current;

      let xRange = Math.max(x1, x2) - Math.min(x1, x2);
      let yRange = Math.max(y1, y2) - Math.min(y1, y2);

      if (xRange > yRange) {
        setWorkingCoords([
          [x1, y1],
          [x2, y1],
        ]);
      } else {
        setWorkingCoords([
          [x1, y1],
          [x1, y2],
        ]);
      }
    },
    [dragging, placing]
  );

  const temporaryShip = useMemo((): Ship | undefined => {
    if (!workingCoords.length) return;
    let [[x1, y1], [x2, y2]] = workingCoords;
    let xRange = Math.max(x1, x2) - Math.min(x1, x2);
    let yRange = Math.max(y1, y2) - Math.min(y1, y2);

    let segments = [
      { x: x1, y: y1, originalCost: 10 },
      { x: x2, y: y2, originalCost: 10 },
    ];

    // Cursed fill solution
    let fill = [];
    let [z1, z2] = x1 === x2 ? [y1, y2] : [x1, x2];
    for (; z1 !== z2; z2 > z1 ? z1++ : z1--) {
      if ((x1 === x2 && z1 === y1) || (y1 === y2 && z1 === x1)) continue;
      const [x, y] = x1 === x2 ? [x1, z1] : [z1, y1];
      fill.push({ x, y, originalCost: 10 });
    }
    segments.splice(1, 0, ...fill);
    // segmentsHash
    let [invalid, invalidReason] = ((): [boolean, string?] => {
      if (Math.max(xRange, yRange) > maxLength) {
        return [true, `Ship is longer than max length of ${maxLength + 1}`];
      }

      if (Math.max(xRange, yRange) < 2) {
        return [true, 'Ship must be a minimum length of 2'];
      }

      if (segments.some((segment) => segmentsHash.has(`${segment.x}-${segment.y}`))) {
        return [true, 'Ship must not intercept any other ships'];
      }

      if (segments.length > remainingSegments) {
        return [true, 'You do not have enough segments. Please purchase more!'];
      }

      return [false];
    })();
    return {
      id: Date.now(),
      invalid,
      invalidReason,
      segments,
    };
  }, [workingCoords, maxLength, segmentsHash, remainingSegments]);

  useEffect(() => {
    dispatch(setTemporaryShip(temporaryShip));
  }, [temporaryShip, dispatch]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const field = e.target as HTMLDivElement;
      if (!placing || !field.className.includes('field')) {
        return;
      }
      const [x, y] = field.id.split('-').map((n: string) => Number(n));
      startCoordsRef.current = [x, y];
      setDragging(true);
    },
    [placing]
  );

  const onExit = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      console.log('onexit');
      if (!placing) return;
      setDragging(false);
    },
    [placing]
  );

  return {
    onMouseDown,
    onMouseOver,
    onExit,
    temporaryShip,
  };
};
