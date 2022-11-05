import { useMemo, useState, useCallback, useEffect } from 'react';

const getSize = (rect: DOMRect) => {
  return Math.min(rect.width - 62, rect.height / 2);
};

export const useBoardSize = () => {
  const _rect = useMemo(() => document.body.getBoundingClientRect(), []);
  const [size, setSize] = useState(getSize(_rect));

  const onResize = useCallback(() => {
    setSize(getSize(document.body.getBoundingClientRect()));
  }, []);

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
