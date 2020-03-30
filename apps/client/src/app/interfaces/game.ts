import { Uci } from 'chessops/types';
import { TournamentDTO, Tournament, fromTournamentDTO } from './tournament';

export interface GameInfoDTO {
  white: string;
  black: string;
  lastPosition: string;
  history: Uci[];
  millisPerMove: number;
  lastMoveDate: string;
  createdAt: string;
  updatedAt: string;
}

export type GameInfo = Omit<
  GameInfoDTO,
  'createdAt' | 'updatedAt' | 'lastMoveDate'
> & {
  createdAt: Date;
  updatedAt: Date;
  lastMoveDate: Date;
};

export interface UserTournamentsDTO {
  activeGames: GameInfoDTO[];
  games: GameInfoDTO[];
  tournaments: TournamentDTO[];
}

export type UserTournaments = Omit<
  UserTournamentsDTO,
  'activeGames' | 'tournaments' | 'games'
> & {
  activeGames: GameInfo[];
  games: GameInfo[];
  tournaments: Tournament[];
};

export function fromGameInfoDTO(dto: GameInfoDTO): GameInfo {
  return {
    ...dto,
    lastMoveDate: new Date(dto.lastMoveDate),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  };
}

export function fromUserTournamentsDTO(
  dto: UserTournamentsDTO
): UserTournaments {
  return {
    ...dto,
    games: dto.games.map(fromGameInfoDTO),
    activeGames: dto.activeGames.map(fromGameInfoDTO),
    tournaments: dto.tournaments.map(fromTournamentDTO)
  };
}
