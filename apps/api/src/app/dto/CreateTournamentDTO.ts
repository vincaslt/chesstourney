import { IsNotEmpty, Min } from 'class-validator';

export class CreateTournamentDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Min(3600000)
  millisPerMove: number;
}
