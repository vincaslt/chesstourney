export interface CreateTournamentDTO {
  name: string;
  millisPerMove: number;
}

export interface TournamentDTO {
  name: string;
  createdBy: string;
  players: string[];
  games: string[];
  millisPerMove: number;
  isStarted: boolean;
}
