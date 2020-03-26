export interface CreateTournamentDTO {
  name: string;
  millisPerMove: number;
}

export interface TournamentDTO {
  _id: string;
  name: string;
  createdBy: string;
  players: string[];
  millisPerMove: number;
  isStarted: boolean;
}

export type Tournament = TournamentDTO;
