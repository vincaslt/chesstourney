import React from 'react';
import 'fomantic-ui-css/semantic.css';
import 'react-chessground/dist/assets/chessground.css';
import 'react-chessground/dist/styles/chessground.css';
import './chessground.theme.css';
import Chessground from 'react-chessground';

export const App = () => {
  return (
    <div>
      <Chessground fen="rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2" />
    </div>
  );
};

export default App;
