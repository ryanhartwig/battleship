import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setTemporaryShip } from '../reducers/game/gameSlice';
import { Ship, ShipSegment } from '../types/ship';

const isField = (e: any) => {
  return e.target.className.includes('field');
};

export const useEditShip = () => {
  const placing = useAppSelector((state) => state.game.placeMode);
  const tempShip = useAppSelector((state) => state.game.temporaryShip);
  const size = useAppSelector((state) => state.settings.size + state.game.levels.movement);
  const placingRef = useRef(placing);
  const remainingSegments = useAppSelector((state) => state.game.segments);
  const startCoordsRef = useRef<string | undefined>();
  const [endCoords, setEndCoords] = useState<string | undefined>();
  const draggingRef = useRef<boolean>(false);
  const maxLength = useAppSelector((state) => state.settings.maxShipLength) - 1;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tempShip) {
      return;
    }

    startCoordsRef.current = undefined;
    setEndCoords(undefined);
  }, [tempShip]);

  useEffect(() => {
    placingRef.current = placing;
  }, [placing]);

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

  const temporaryShip = useMemo((): Ship | undefined => {
    if (!startCoordsRef.current || !endCoords) {
      return;
    }

    const [startX, startY] = startCoordsRef.current.split('-').map((n) => Number(n));
    const [endX, endY] = endCoords.split('-').map((n) => Number(n));
    const xRange = Math.abs(startX - endX);
    const yRange = Math.abs(startY - endY);
    let segments: ShipSegment[] = [];
    if (xRange > yRange) {
      for (let x = Math.min(startX, endX); x < Math.max(startX, endX) + 1; x++) {
        segments.push({
          originalCost: 10,
          x,
          y: startY,
        });
      }
    } else {
      for (let y = Math.min(startY, endY); y < Math.max(startY, endY) + 1; y++) {
        segments.push({
          originalCost: 10,
          x: startX,
          y,
        });
      }
    }
    let [invalid, invalidReason] = ((): [boolean, string?] => {
      if (Math.max(xRange, yRange) > maxLength) {
        return [true, `Ship is longer than max length of ${maxLength + 1}`];
      }

      if (Math.max(xRange, yRange) < 2) {
        return [true, 'Ship must be a minimum length of 3'];
      }

      if (segments.some((segment) => segmentsHash.has(`${segment.x}-${segment.y}`))) {
        return [true, 'Ship must not intercept any other ships'];
      }

      if (segments.length > remainingSegments) {
        return [true, 'You do not have enough segments. Please purchase more!'];
      }

      if (segments.some(({ x, y }) => Math.max(x, y) > size)) {
        return [true, 'You can not build in the grey zone. Upgrade your movement!'];
      }

      return [false];
    })();

    return {
      id: Date.now(),
      invalid,
      invalidReason,
      segments,
    };
  }, [endCoords, maxLength, segmentsHash, remainingSegments, size]);

  useEffect(() => {
    dispatch(setTemporaryShip(temporaryShip));
  }, [temporaryShip, dispatch]);

  //////////////////////////
  //////////////////////////
  //////   HANDLERS  ///////
  //////////////////////////
  //////////////////////////
  const onStart = useCallback((coords: string) => {
    startCoordsRef.current = coords;
    draggingRef.current = true;
    setEndCoords(coords);
  }, []);

  const onMove = useCallback((coords: string) => {
    setEndCoords(coords);
  }, []);

  const onEnd = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const field = e.target as HTMLDivElement;
      if (!placingRef.current || !isField(e)) {
        return;
      }
      onStart(field.id);
    },
    [onStart]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const field = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)!;
      if (!placingRef.current || !startCoordsRef.current || !isField(e)) {
        return;
      }
      onMove(field.id);
    },
    [onMove]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const field = e.target as HTMLDivElement;
      if (!placingRef.current || !isField(e)) {
        return;
      }
      e.preventDefault();
      onStart(field.id);
    },
    [onStart]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const field = e.target as HTMLDivElement;
      if (!placingRef.current || !draggingRef.current || !startCoordsRef.current || !isField(e)) {
        return;
      }
      e.preventDefault();
      onMove(field.id);
    },
    [onMove]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!placingRef.current || !isField(e)) {
        return;
      }
      e.preventDefault();
      onEnd();
    },
    [onEnd]
  );

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    temporaryShip,
  };
};
