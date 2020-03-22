import { api, withAuth } from './apiHelpers';
import { SignInDTO, AuthTokensDTO } from './interfaces/auth';
import { UserInfoDTO, fromUserInfoDTO, CreateUserDTO } from './interfaces/user';
import { CreateTournamentDTO, TournamentDTO } from './interfaces/tournament';
import { Uci } from 'chessops/types';
import { GameInfoDTO, fromGameInfoDTO } from './interfaces/game';

export const register = (user: CreateUserDTO) =>
  api.post('/user', user).then(res => res.data);

export const signIn = (credentials: SignInDTO) =>
  api
    .post<{
      tokens: AuthTokensDTO;
      user: UserInfoDTO;
    }>('/login', credentials)
    .then(res => ({
      tokens: res.data.tokens,
      user: fromUserInfoDTO(res.data.user)
    }));

export const createTournament = withAuth(
  headers => (dto: CreateTournamentDTO) =>
    api.post<TournamentDTO>('/tournament', dto, {
      headers
    })
);

export const startTournament = withAuth(headers => (id: string) =>
  api.post<TournamentDTO>(`/tournament/${id}/start`, undefined, {
    headers
  })
);

export const joinTournament = withAuth(headers => (id: string) =>
  api.post<TournamentDTO>(`/tournament/${id}/join`, undefined, {
    headers
  })
);

export const submitMove = withAuth(headers => (id: string, move: Uci) =>
  api.post<TournamentDTO>(`/game/${id}/move`, move, {
    headers
  })
);

export const getGame = withAuth(headers => (id: string) =>
  api
    .get<GameInfoDTO>(`/game/${id}`, {
      headers
    })
    .then(({ data }) => data)
    .then(fromGameInfoDTO)
);
