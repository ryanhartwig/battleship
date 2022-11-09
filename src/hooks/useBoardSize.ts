import { useMemo, useState, useCallback, useEffect } from 'react';
import { useOrientation } from './useOrientation';

const getSize = (rect: DOMRect, orientation: 'landscape' | 'portrait') => {
  if (orientation === 'landscape') {
    return Math.min(rect.width / 2 - 128, rect.height - 176);
  }
  return Math.min(rect.width - 62, rect.height / 2);
};

export const useBoardSize = () => {
  const orientation = useOrientation();

  const _rect = useMemo(() => document.body.getBoundingClientRect(), []);
  const [size, setSize] = useState(getSize(_rect, orientation));

  const onResize = useCallback(() => {
    setSize(getSize(document.body.getBoundingClientRect(), orientation));
  }, [orientation]);

  useEffect(() => {
    const timeout = setTimeout(onResize, 500);

    return () => clearTimeout(timeout);
  }, [onResize]);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  return size;
};
