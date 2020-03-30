import { UserInfoDTO, UserInfo, fromUserInfoDTO } from './user';

export interface CreateTournamentDTO {
  name: string;
  millisPerMove: number;
}

export interface TournamentDTO {
  _id: string;
  name: string;
  createdBy: string;
  players: UserInfoDTO[];
  millisPerMove: number;
  isStarted: boolean;
}

export type Tournament = Omit<TournamentDTO, 'players'> & {
  players: UserInfo[];
};

export function fromTournamentDTO(dto: TournamentDTO): Tournament {
  return {
    ...dto,
    players: dto.players.map(fromUserInfoDTO)
  };
}
