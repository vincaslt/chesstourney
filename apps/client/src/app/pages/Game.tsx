import React, { useRef, useState, useEffect } from 'react';
import 'react-chessground/dist/assets/chessground.css';
import 'react-chessground/dist/styles/chessground.css';
import './chessground.theme.css';
import { Container } from 'semantic-ui-react';
import Chessground from 'react-chessground';
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
  const game = useRef<GameInfo>(null);
  const [fen, setFen] = useState(
    () => game.current?.lastPosition || INITIAL_BOARD_FEN
  );
  const [history, setHistory] = useState<Uci[]>([]);

  const position = Chess.fromSetup(parseFen(fen).unwrap()).unwrap();

  useEffect(() => {
    getGame(id).then(currentGame => {
      game.current = currentGame;
      setFen(currentGame.lastPosition);
      setHistory(currentGame.history);
    });
  }, [id]);

  const dests = {};
  for (const [from, squares] of position.allDests()) {
    const fromDests = [];
    for (const square of squares) {
      fromDests.push(makeSquare(square));
    }
    dests[makeSquare(from)] = fromDests;
  }

  const turnWhite = position.turn === 'white';
  const turnBlack = position.turn === 'black';
  const isWhite = game.current?.white === userInfo._id;
  const isBlack = game.current?.black === userInfo._id;
  const isPlayersTurn = (turnWhite && isWhite) || (turnBlack && isBlack);

  return (
    <Container>
      <Chessground
        turnColor={turnWhite ? 'white' : 'black'}
        orientation={isWhite ? 'white' : 'black'}
        movable={{
          showDests: isPlayersTurn,
          free: false,
          color: isPlayersTurn
            ? (turnWhite && 'white') || (turnBlack && 'black')
            : undefined,
          dests
        }}
        fen={fen}
        onMove={(from, to) => {
          const move = { from: parseSquare(from), to: parseSquare(to) };
          position.play(move);
          submitMove(id, move);
          setFen(makeFen(position.toSetup()));
          setHistory(history => [...history, move]);
        }}
      />
      {userInfo.username}
      <ol>
        {history.map(uci => (
          <li key={makeUci(uci)}>{makeUci(uci)}</li>
        ))}
      </ol>
    </Container>
  );
}

export default Game;
