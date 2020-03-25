import React, { useRef, useState, useEffect } from 'react';
import 'react-chessground/dist/assets/chessground.css';
import 'react-chessground/dist/styles/chessground.css';
import './chessground.theme.css';
import { Container } from 'semantic-ui-react';
import Chessground from 'react-chessground';
import { Dests, Key } from 'chessground/types';
import { parseSquare, makeSquare, makeUci } from 'chessops/util';
import { Chess } from 'chessops/chess';
import { Uci } from 'chessops/types';
import { makeFen, parseFen, INITIAL_BOARD_FEN } from 'chessops/fen';
import { useParams } from 'react-router';
import { getGame, submitMove } from '../api';
import UserContainer from '../state/UserContainer';
import { GameInfo } from '../interfaces/game';

function Game() {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = UserContainer.useContainer();
  const game = useRef<{ info?: GameInfo }>({});
  const [fen, setFen] = useState(
    () => game.current.info?.lastPosition || INITIAL_BOARD_FEN
  );
  const [history, setHistory] = useState<Uci[]>([]);

  const position = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();

  useEffect(() => {
    getGame(id).then(currentGame => {
      game.current.info = currentGame;
      setFen(currentGame.lastPosition);
      setHistory(currentGame.history);
    });
  }, [id]);

  const dests: Dests = {};
  for (const [from, squares] of position.allDests()) {
    const fromDests = [];
    for (const square of squares) {
      fromDests.push(makeSquare(square));
    }
    dests[makeSquare(from)] = fromDests as Key[];
  }

  const turnWhite = position.turn === 'white';
  const isWhite = game.current.info?.white === userInfo?._id;
  const isBlack = game.current.info?.black === userInfo?._id;
  const isPlayersTurn = turnWhite ? isWhite : isBlack;

  const handleMove = (_from: Key, _to: Key) => {
    const from = parseSquare(_from);
    const to = parseSquare(_to);
    if (!from || !to) {
      throw new Error('Invalid move');
    }
    const move = { from, to };
    position.play(move);
    submitMove(id, move);
    setFen(makeFen(position.toSetup()));
    setHistory(history => [...history, move]);
  };

  return (
    <Container>
      <Chessground
        turnColor={turnWhite ? 'white' : 'black'}
        orientation={isWhite ? 'white' : 'black'}
        movable={{
          showDests: isPlayersTurn,
          free: false,
          color: isPlayersTurn ? (turnWhite ? 'white' : 'black') : undefined,
          dests
        }}
        fen={fen}
        onMove={handleMove}
      />
      {userInfo?.username}
      <ol>
        {history.map(uci => (
          <li key={makeUci(uci)}>{makeUci(uci)}</li>
        ))}
      </ol>
    </Container>
  );
}

export default Game;
