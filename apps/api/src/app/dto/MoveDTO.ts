import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Square, Role, UciMove } from 'chessops/types';

export class MoveDTO implements UciMove {
  @IsNotEmpty()
  @IsNumber()
  from: Square;

  @IsNotEmpty()
  @IsNumber()
  to: Square;

  // TODO: validate legal piece
  @IsOptional()
  @IsString()
  promotion?: Role;
}
