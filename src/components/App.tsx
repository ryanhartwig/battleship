import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { richify } from '../reducers/game/gameSlice';
import './App.css';
import { Game } from './Game';

declare global {
  interface Window {
    getRich: any;
  }
}

function App() {
  const dispatch = useAppDispatch();

  const getRich = useCallback(() => {
    dispatch(richify());
  }, [dispatch]);

  useEffect(() => {
    window.getRich = getRich || {};
  }, [getRich]);

  return <Game />;
}

export default App;
