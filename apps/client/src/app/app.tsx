import React, { useRef, useState } from 'react';
import 'fomantic-ui-css/semantic.css';
import 'react-chessground/dist/assets/chessground.css';
import 'react-chessground/dist/styles/chessground.css';
import './chessground.theme.css';
import Chessground from 'react-chessground';
import { Chess } from 'chessops/chess';
import { makeFen, parseFen } from 'chessops/fen';
import { makeSquare, parseSquare, makeUci } from 'chessops/util';
import {
  signIn,
  joinTournament,
  createTournament,
  register,
  startTournament,
  submitMove,
  getGame
} from './api';
import { Uci } from 'chessops/types';

export const App = () => {
  const pos = useRef(Chess.default());
  const [fen, setFen] = useState(() => makeFen(pos.current.toSetup()));
  const [history, setHistory] = useState<Uci[]>([]);
  const [tournamentToken, setTournamentToken] = useState('');

  const dests = {};
  for (const [from, squares] of pos.current.allDests()) {
    const fromDests = [];
    for (const square of squares) {
      fromDests.push(makeSquare(square));
    }
    dests[makeSquare(from)] = fromDests;
  }

  const handle1Click = () => {
    signIn({ email: 'user1@email.com', password: 'password' }).then(
      ({ tokens: { accessToken, refreshToken } }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    );
  };

  const handle2Click = () => {
    signIn({ email: 'user2@email.com', password: 'password' }).then(
      ({ tokens: { accessToken, refreshToken } }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    );
  };

  const handleJoin = () => {
    joinTournament(tournamentToken);
  };

  const handleCreate = () => {
    createTournament({ name: 'turnyr', millisPerMove: 1000 * 60 * 60 * 4 });
  };

  const handleRegister = () => {
    register({
      email: 'user1@email.com',
      password: 'password',
      username: 'u1'
    });
    register({
      email: 'user2@email.com',
      password: 'password',
      username: 'u2'
    });
  };

  const handleStart = () => {
    startTournament(tournamentToken);
  };

  const handleLoad = () => {
    getGame(tournamentToken).then(({ lastPosition, history }) => {
      pos.current = Chess.fromSetup(parseFen(lastPosition).unwrap()).unwrap();
      setFen(makeFen(pos.current.toSetup()));
      setHistory(history);
    });
  };

  return (
    <div>
      <Chessground
        movable={{
          showDests: true,
          free: false,
          dests
        }}
        fen={fen}
        onMove={(from, to) => {
          const move = { from: parseSquare(from), to: parseSquare(to) };
          pos.current.play(move);
          setFen(makeFen(pos.current.toSetup()));
          submitMove(tournamentToken, move);
        }}
      />
      <button onClick={handleRegister}>Register Both</button>
      <button onClick={handle1Click}>Login 1</button>
      <button onClick={handle2Click}>Login 2</button>
      <input
        onChange={e => setTournamentToken(e.target.value)}
        value={tournamentToken}
      />
      <button onClick={handleJoin}>Join</button>
      <button onClick={handleCreate}>Create</button>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleLoad}>Load</button>
      <ol>
        {history.map(uci => (
          <li>{makeUci(uci)}</li>
        ))}
      </ol>
    </div>
  );
};

export default App;
