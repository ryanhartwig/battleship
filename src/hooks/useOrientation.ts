import { useCallback, useEffect, useMemo, useState } from 'react';

export const useOrientation = () => {
  const _rect = useMemo(() => document.body.getBoundingClientRect(), []);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(_rect.width > _rect.height ? 'landscape' : 'portrait');

  const onResize = useCallback(() => {
    const rect = document.body.getBoundingClientRect();
    setOrientation(rect.width > rect.height ? 'landscape' : 'portrait');
  }, []);

  useEffect(() => {
    const timeout = setTimeout(onResize, 500);

    return () => clearTimeout(timeout);
  }, [onResize]);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  return orientation;
};
