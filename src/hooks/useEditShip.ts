import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectShip, setTemporaryShip } from '../reducers/game/gameSlice';
import { DirectionalBomb } from '../types/items';
import { ShipSegment } from '../types/ship';
import { getRange } from '../utility/getRange';

const isField = (e: any) => {
  return e.target.className.includes('field');
};

export const useEditShip = () => {
  const placing = useAppSelector((state) => state.game.placeMode);
  const temporaryShip = useAppSelector((state) => state.game.temporaryShip);
  const editing = useAppSelector((s) => s.game.editingShip);
  const actions = useAppSelector((s) => s.game.actions);
  const size = useAppSelector((state) => state.settings.size + state.game.levels.movement);
  const bomb = useAppSelector((state) => state.game.store.find((s) => s.type === 'directional') as DirectionalBomb);
  const placingRef = useRef(placing);
  const remainingSegments = useAppSelector((state) => state.game.inventory.segment);
  const startCoordsRef = useRef<string | undefined>();
  const lockAxisRef = useRef<'x' | 'y'>();
  const [endCoords, setEndCoords] = useState<string | undefined>();
  const draggingRef = useRef<boolean>(false);
  const maxLength = useAppSelector((state) => state.settings.maxShipLength) - 1;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (temporaryShip) {
      return;
    }

    startCoordsRef.current = undefined;
    setEndCoords(undefined);
  }, [temporaryShip]);

  useEffect(() => {
    placingRef.current = placing;
  }, [placing]);

  const ships = useAppSelector((state) => state.game.ships);

  const segmentsMap = useMemo(() => {
    const result = new Map<string, number>();
    ships
      .filter((s) => s.id !== editing)
      .forEach((ship) => {
        ship.segments.forEach((segment) => {
          result.set(`${segment.x}-${segment.y}`, ship.id);
        });
      });
    return result;
  }, [ships, editing]);
  const attacksSet = useMemo(() => {
    const result = new Set<string>();
    actions
      .filter((a) => a.type === 'attack')
      .forEach(({ x, y, weapons, direction }) => {
        result.add(`${x}-${y}`);
        const range = getRange(`${x}-${y}`, weapons[0], direction, bomb);
        for (let cX = range[0].x; cX <= range[1].x; cX++) {
          for (let cY = range[0].y; cY <= range[1].y; cY++) {
            result.add(`${cX}-${cY}`);
          }
        }
      });
    return result;
  }, [actions, bomb]);

  useEffect(() => {
    if (!startCoordsRef.current || !endCoords) {
      return;
    }

    const [sX, sY] = startCoordsRef.current.split('-').map((n) => Number(n));
    const [eX, eY] = endCoords.split('-').map((n) => Number(n));
    let segments: ShipSegment[] = [];
    const startX = Math.min(sX, ...segments.map((s) => s.x));
    const endX = Math.max(eX, ...segments.map((s) => s.x));
    const startY = Math.min(sY, ...segments.map((s) => s.y));
    const endY = Math.max(eY, ...segments.map((s) => s.y));
    const xRange = Math.abs(startX - endX);
    const yRange = Math.abs(startY - endY);
    let existingSegments = new Set<string>();
    if (editing) {
      const ship = ships.find((s) => s.id === editing);
      if (ship) {
        segments = [...ship.segments];
        segments.forEach((s) => existingSegments.add(`${s.x}-${s.y}`));
      }
    }
    const doX = () => {
      for (let x = Math.min(startX, endX); x < Math.max(startX, endX) + 1; x++) {
        if (existingSegments.has(`${x}-${startY}`)) {
          continue;
        }
        segments.push({
          x,
          y: startY,
          new: true,
        });
      }
    };
    const doY = () => {
      for (let y = Math.min(startY, endY); y < Math.max(startY, endY) + 1; y++) {
        if (existingSegments.has(`${startX}-${y}`)) {
          continue;
        }
        segments.push({
          x: startX,
          y,
          new: true,
        });
      }
    };
    if (lockAxisRef.current === 'x') {
      doX();
    } else if (lockAxisRef.current === 'y') {
      doY();
    } else if (xRange > yRange) {
      doX();
    } else {
      doY();
    }
    let [invalid, invalidReason] = ((): [boolean, string?] => {
      if (segments.length - 1 > maxLength) {
        return [true, `Ship is longer than max length of ${maxLength + 1}`];
      }

      if (segments.length < 3) {
        return [true, 'Ship must be a minimum length of 3'];
      }

      if (segments.some((segment) => segmentsMap.has(`${segment.x}-${segment.y}`))) {
        return [true, 'Ship must not intercept any other ships'];
      }

      if (segments.filter((s) => s.new).length > remainingSegments) {
        return [true, 'You do not have enough segments. Please purchase more!'];
      }

      if (segments.some(({ x, y }) => Math.max(x, y) > size)) {
        return [true, 'You can not build in the grey zone. Upgrade your movement!'];
      }

      if (segments.some(({ x, y }) => attacksSet.has(`${x}-${y}`))) {
        return [true, 'You can not build on destroyed tiles / ships.'];
      }

      return [false];
    })();

    dispatch(
      setTemporaryShip({
        id: Date.now(),
        invalid,
        invalidReason,
        segments,
      })
    );
  }, [endCoords, maxLength, segmentsMap, attacksSet, remainingSegments, size, ships, editing, dispatch]);

  //////////////////////////
  //////////////////////////
  //////   HANDLERS  ///////
  //////////////////////////
  //////////////////////////
  const onStart = useCallback(
    (coords: string) => {
      startCoordsRef.current = coords;
      draggingRef.current = true;
      setEndCoords(coords);
      let shipId = segmentsMap.get(coords);
      dispatch(selectShip(shipId));
      const ship = ships.find((s) => s.id === shipId);
      if (shipId && ship) {
        lockAxisRef.current = ship.segments[0].x === ship.segments[1].x ? 'y' : 'x';
      } else {
        lockAxisRef.current = undefined;
      }
    },
    [dispatch, segmentsMap, ships]
  );

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
