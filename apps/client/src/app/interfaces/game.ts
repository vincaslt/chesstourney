import { Uci } from 'chessops/types';

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

export function fromGameInfoDTO(dto: GameInfoDTO): GameInfo {
  return {
    ...dto,
    lastMoveDate: new Date(dto.lastMoveDate),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  };
}
