import React, { useState } from 'react';
import {
  joinTournament,
  createTournament,
  register,
  startTournament
} from '../api';
import UserContainer from '../state/UserContainer';

export const Login = () => {
  const { login } = UserContainer.useContainer();
  const [tournamentToken, setTournamentToken] = useState('');

  const handle1Click = () => {
    login({ email: 'user1@email.com', password: 'password' });
  };

  const handle2Click = () => {
    login({ email: 'user2@email.com', password: 'password' });
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

  return (
    <div>
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
    </div>
  );
};

export default Login;
