import { api, withAuth } from './utils/apiHelpers';
import { SignInDTO, AuthTokensDTO } from './interfaces/auth';
import { UserInfoDTO, fromUserInfoDTO, CreateUserDTO } from './interfaces/user';
import {
  CreateTournamentDTO,
  TournamentDTO,
  fromTournamentDTO
} from './interfaces/tournament';
import { Uci } from 'chessops/types';
import {
  GameInfoDTO,
  fromGameInfoDTO,
  UserTournamentsDTO,
  fromUserTournamentsDTO
} from './interfaces/game';

export const register = (user: CreateUserDTO) =>
  api.post('/user', user).then(res => res.data);

export const getUserInfo = withAuth(headers => () =>
  api
    .get<{ user: UserInfoDTO }>('/user/me', { headers })
    .then(res => ({
      user: fromUserInfoDTO(res.data.user)
    }))
);

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

export const getUserTournaments = withAuth(headers => () =>
  api
    .get<UserTournamentsDTO>('/tournament', { headers })
    .then(res => res.data)
    .then(fromUserTournamentsDTO)
);

export const createTournament = withAuth(
  headers => (dto: CreateTournamentDTO) =>
    api
      .post<TournamentDTO>('/tournament', dto, {
        headers
      })
      .then(res => res.data)
      .then(fromTournamentDTO)
);

export const startTournament = withAuth(headers => (id: string) =>
  api
    .post<TournamentDTO>(`/tournament/${id}/start`, undefined, {
      headers
    })
    .then(res => res.data)
    .then(fromTournamentDTO)
);

export const joinTournament = withAuth(headers => (id: string) =>
  api
    .post<TournamentDTO>(`/tournament/${id}/join`, undefined, {
      headers
    })
    .then(res => res.data)
    .then(fromTournamentDTO)
);

export const submitMove = withAuth(headers => (id: string, move: Uci) =>
  api
    .post<TournamentDTO>(`/game/${id}/move`, move, {
      headers
    })
    .then(res => res.data)
    .then(fromTournamentDTO)
);

export const getGame = withAuth(headers => (id: string) =>
  api
    .get<GameInfoDTO>(`/game/${id}`, {
      headers
    })
    .then(({ data }) => data)
    .then(fromGameInfoDTO)
);
